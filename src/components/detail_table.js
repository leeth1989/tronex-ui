import { Table, Divider, Button, Icon, Col, Row } from 'antd';
import React from 'react';
import reqwest from 'reqwest';
import { Link } from 'dva/router';
import {Breadcrumb } from 'antd';
import Config from '../utils/config';


const nameMap = {
  'height': 'Height',
  'parentID': 'Parent ID',
  'sig': 'Signature',
  'size': 'Size',
  'time': 'Time',
  'txCount': 'TX Count',
  'txTrieRoot': 'TX Trie Root',
  'witness': 'Witness',
  'id': 'ID'
}

const serverHost = Config.host;

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTop: [],
      dataBottom: [],
      pagination: false,
      loading: false,
    }

    this.id = this.props.id;


    this.columnsTop = [
      {
        title: 'Name',
        dataIndex: 'name',
        render: (text, record, index) => {
          return nameMap[text] || text;
        },
        align: 'right',
        width: 150
      },
      {
        title: 'Value',
        dataIndex: 'value'
      }
    ]

    this.columnsBottom = [
      {
        title: 'Contract Type',
        dataIndex: 'contractType'
      },{
        title: 'From',
        dataIndex: 'from',
        render: (text, record, index) => {
          return <Link to={`/account/${record.from}${Config.search}`}>{record.from}</Link>;
        }
      },
      {
        title: '',
        render: (text, record, index) => {
          return <Icon type="swap-right" />;
        }
      },
      {
        title: 'To',
        dataIndex: 'to',
        render: (text, record, index) => {
          return <Link to={`/account/${record.to}${Config.search}`}>{record.to}</Link>;
        }
      },{
        title: 'Amount',
        dataIndex: 'amount'
      }
    ]
  }

  // shouldComponentUpdate(nextProps) {
  //   if (this.props.id !== nextProps) {

  //   }
  //   return true;
  // }

  componentDidUpdate() {
    if (this.props.id !== this.id) {
      this.fetch();
      this.id = this.props.id;
    }
    // this.fetch(this.props.id);
  }

  fetch = (params = {}) => {
    this.setState({ loading: true });
    reqwest({
      // url: 'https://randomuser.me/api',
      url: serverHost + '/v1/block/' + this.props.id,
      // method: 'get',
      // data: {
      //   results: 10,
      //   ...params,
      // },
      type: 'json',
    }).then((data) => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 1;

      let dataTop = [];
      let dataBottom = [];
      
      dataTop.push({
        name: 'id',
        value: data['id']
      });

      Object.keys(data.header).forEach((key) => {
        if (key != 'size') {
          dataTop.push({
            name: key,
            value: data.header[key]
          })
        }
      });
      

      data.txs.forEach((obj) => {
        obj.contractList.forEach((_obj) => {
          if (_obj) dataBottom.push(_obj)
        })
      })
      this.setState({
        loading: false,
        hash: data.hash,
        dataTop: dataTop,
        dataBottom: dataBottom
        // pagination,
      });
    }).fail(() => {
      this.setState({
        dataTop: [],
        dataBottom: []
      })
    });
  }

  componentDidMount() {
    this.fetch();
  }

  goNext() {
    window.location.href = '/#/block/' + (parseInt(this.props.id) + 1) + Config.search;
    // window.location.reload();
  }

  goPrev() {
    window.location.href = '/#/block/' + (parseInt(this.props.id) - 1) + Config.search;
    // window.location.reload();
  }

  render() {
    return (<div className="detail-content" id={this.props.id} >
      {<Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item><Link to={"/" + Config.search}>Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{this.state.hash || ''}</Breadcrumb.Item>
      </Breadcrumb>}
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
      <Row>
        <Col span={12}>
        <Button type="default" onClick={this.goPrev.bind(this)} >
          <Icon type="left" />Previous
        </Button>
        </Col>
        <Col span={12}>
          <Button type="default" onClick={this.goNext.bind(this)} style={{float: 'right'}}>
            Next<Icon type="right" />
          </Button>
        </Col>
      </Row>
        <Table 
          dataSource={this.state.dataTop} 
          columns={this.columnsTop} 
          rowKey={record => record.name}
          pagination={this.state.pagination}
          loading={this.state.loading}
          showHeader={false}
          size="middle"
          rowClassName="detail-row"
          // onChange={this.handleTableChange} 
        />
        <Divider orientation="left">Transactions</Divider>
        <Table 
          dataSource={this.state.dataBottom} 
          columns={this.columnsBottom} 
          rowKey={record => Math.floor(Math.random(0,1) * 10000)}
          pagination={this.state.pagination}
          loading={this.state.loading}
          size="small"
          />
      </div>
    </div>);
  }
}

export default List;
