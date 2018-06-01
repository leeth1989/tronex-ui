import { Table, Button, Icon, Divider, Col, Row } from 'antd';
import React from 'react';
import reqwest from 'reqwest';
// import Config from '../utils/config';

const ButtonGroup = Button.Group;
// const Search = Input.Search;

const dataSource = [/*{
  key: '1',
  name: '胡彦斌',
  id: 'yyyy',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  id: 'xxxx',
  age: 42,
  address: '西湖区湖底公园1号'
}*/];

// const serverHost = Config.host;

class List extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: dataSource,
      pagination: {},
      loading: false,
      pageIndex: 1
    }

    this.firstData = [];

    this.columns = this.props.columns;
    /*
    this.columns = [{
      title: 'Height',
      dataIndex: 'height',
      key: 'header.height',
      render: (text, record, index) => {
        return <Link to={`/block/${record.header.height}${Config.search}`}>{record.header.height}</Link>;
      },
    }, {
      title: 'Time',
      render: (text, record, index) => {
        return record.header.time;
      },
      key: 'header.time',
    }, {
      title: 'TX Count',
      render: (text, record, index) => {
        return record.header.txCount;
      },
      key: 'header.txCount',
    }, {
      title: 'Witness',
      render: (text, record, index) => {
        return record.header.witness;
      },
      key: 'header.witness',
    }];    */
  }

  // handleTableChange = (pagination, filters, sorter) => {
  //   console.log('handleTableChange', pagination, filters, sorter);

  //   const pager = { ...this.state.pagination };
  //   pager.current = pagination.current;
  //   this.setState({
  //     pagination: pager,
  //   });
  //   this.fetch({
  //     results: pagination.pageSize,
  //     page: pagination.current,
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     ...filters,
  //   });
  // }

  fetch(params) {
    this.setState({ loading: true });
    reqwest({
      url: this.props.fetchUrl(params),
      // url: serverHost + '/v1/blocks/page/' + params.pageIndex,
      method: 'get',
      type: 'json',
    }).then((data) => {
      if (params.pageIndex === 1) {
        const prevData = this.firstData;
        /*
        const prevHeight = prevData[0] ? prevData[0].header.height : 0;

        data.forEach((d, index) => {
          if (d.header.height > prevHeight) {
            d.isNew = true;
          }
        })*/
        data = this.props.fetchCallback(params, prevData, data);
        this.firstData = data;
      }
      this.setState({
        loading: false,
        pageIndex: params.pageIndex,
        data: data
      });
    }).fail(() => {
      this.setState({
        loading: false,
        data: []
      })
    });
  }

  componentDidMount() {
    this.fetch({
      pageIndex: this.state.pageIndex
    });
    this.refresh()
  }

  goNext() {
    this.fetch({
      pageIndex: this.state.pageIndex + 1
    })
  }

  goPrev() {
    this.fetch({
      pageIndex: Math.max(1, this.state.pageIndex - 1)
    })
  }

  refresh() {
    clearTimeout(this.timer);
    if (!this.state.loading && this.state.pageIndex === 1) {
      this.fetch({
        pageIndex: 1
      });
    };
    this.timer = setTimeout(() => {this.refresh()}, 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  reload() {
    this.fetch({
      pageIndex: 1
    });
  }

  search(value) {
    reqwest({
      url: this.props.searchUrl(value),
      // url: serverHost + '/v1/block/search',
      data: {
        q: value
      },
      type: 'json',
    }).then((data) => {
      if (data) {
        this.props.searchCallback(data);
      }
    }).fail(() => {
      alert('not found');
    });
  }

  render() {
    const pageNav = (<ButtonGroup>
      <Button type="default" onClick={this.goPrev.bind(this)} disabled={this.state.pageIndex < 2} loading={this.state.loading }>
        <Icon type="left" />Go back
      </Button>
      <Button type="default">
        {this.state.pageIndex}
      </Button>
      <Button type="default" loading={this.state.loading} onClick={this.goNext.bind(this)} >
        Go forward<Icon type="right" />
      </Button>
    </ButtonGroup>);
    return (<div>
      {this.props.search || this.props.pagination ? 
      <Row>
      {this.props.pagination ? 
      <Col span={18}>
        {pageNav} &nbsp;&nbsp;
        <ButtonGroup>
          <Button type="default" onClick={this.reload.bind(this)} loading={this.state.loading} >
            <Icon type="reload" />
          </Button>
        </ButtonGroup>
      </Col>
       : <Col span={18} /> }
       {this.props.search ? 
      <Col span={6}>
        {/* <Search placeholder={this.props.searchPlaceholder} onSearch={this.search.bind(this)} enterButton className="search-bar" /> */}
      </Col>
       : <Col span={6} /> }
      </Row> : null}
      {this.props.search || this.props.pagination ? <Divider/> : null}
      <Table 
        dataSource={this.state.data} 
        columns={this.columns} 
        rowKey={this.props.rowKey}
        rowClassName={(record, index)=>{
          return record.isNew ? 'new': '';
        }}
        pagination={false}
        loading={this.state.loading}
        className="table-custom"
      />
      <Divider/>
      {this.props.search || this.props.pagination ? pageNav : null}
    </div>);
  }
}
List.props = {
  search: true,
  pagination: true
}

export default List;
