import { Table, Button, Icon, Divider, Col, Input, Row } from 'antd';
import React from 'react';
import reqwest from 'reqwest';
import { Link } from 'dva/router';

const ButtonGroup = Button.Group;
const Search = Input.Search;

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

const serverHost = 'http://127.0.0.1:8080'

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

    this.columns = [{
      title: 'Height',
      dataIndex: 'height',
      key: 'header.height',
      render: (text, record, index) => {
        return <Link to={`/block/${record.header.height}`}>{record.header.height}</Link>;
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
    }];    
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
      url: serverHost + '/v1/blocks/page/' + params.pageIndex,
      method: 'get',
      type: 'json',
    }).then((data) => {
      console.log(data);
      if (params.pageIndex === 1) {
        const prevData = this.firstData;
        this.firstData = data;
        const prevHeight = prevData[0] ? prevData[0].header.height : 0;

        data.forEach((d, index) => {
          if (d.header.height > prevHeight) {
            d.isNew = true;
          }
        })
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
    if (!this.state.loading && this.state.pageIndex === 1) {
      this.fetch({
        pageIndex: 1
      });
    };
    setTimeout(() => {this.refresh()}, 5000);
  }

  reload() {
    this.fetch({
      pageIndex: 1
    });
  }

  search(value) {
    reqwest({
      url: serverHost + '/v1/block/search',
      data: {
        q: value
      },
      type: 'json',
    }).then((data) => {
      console.log(data);
      if (data) {
        window.location.hash = '#/block/' + data.header.height;
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
      <Row>
      <Col span={18}>
        {pageNav} &nbsp;&nbsp;
        <ButtonGroup>
          <Button type="default" onClick={this.reload.bind(this)} loading={this.state.loading} >
            <Icon type="reload" />
          </Button>
        </ButtonGroup>
      </Col>
      <Col span={6}>
        <Search placeholder="Height or ID" onSearch={this.search.bind(this)} enterButton />
      </Col>
      </Row>
      <Divider/>
      <Table 
        dataSource={this.state.data} 
        columns={this.columns} 
        rowKey={record => record.header.height}
        rowClassName={(record, index)=>{
          return record.isNew ? 'new': '';
        }}
        pagination={false}
        loading={this.state.loading}
      />
      <Divider/>
      {pageNav}
    </div>);
  }
}

export default List;
