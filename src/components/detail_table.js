import { Table, Divider } from 'antd';
import React from 'react';
import reqwest from 'reqwest';
import { Link } from 'dva/router';
import {Layout, Menu, Breadcrumb } from 'antd';


const dataSource = [/*{
  key: '1',
  name: 'name 1',
  value: 'value of name 1'
}, {
  key: '2',
  name: 'name 2',
  value: 'value of name 2'
}*/];

const nameMap = {
  'height': 'Height',
  'parentID': 'Parent ID',
  'sig': 'Signature',
  'size': 'Size',
  'time': 'Time',
  'txCount': 'TX Count',
  'txTrieRoot': 'TX Trie Root',
  'witness': 'Witness'
}

const serverHost = 'http://127.0.0.1:8080'

class List extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataTop: [],
      dataBottom: [],
      pagination: false,
      loading: false,
    }

    // this.columnsTop = [{
    //   title: 'height',
    //   render: (text, record, index) => {
    //     return record.header.height;
    //   },
    //   key: 'header.height'
    // }, {
    //   title: 'Parent ID',
    //   render: (text, record, index) => {
    //     return record.header.parentID;
    //   },
    //   key: 'header.parentID'
    // }, {
    //   title: 'sig',
    //   render: (text, record, index) => {
    //     return record.header.sig;
    //   },
    //   key: 'header.sig'
    // }, {
    //   title: 'size',
    //   render: (text, record, index) => {
    //     return record.header.size;
    //   },
    //   key: 'header.size'
    // }, {
    //   title: 'Time',
    //   render: (text, record, index) => {
    //     return record.header.time;
    //   },
    //   key: 'header.time'
    // }, {
    //   title: 'TX Count',
    //   render: (text, record, index) => {
    //     return record.header.txCount;
    //   },
    //   key: 'header.txCount'
    // }, {
    //   title: 'TX Trie Root',
    //   render: (text, record, index) => {
    //     return record.header.txTrieRoot;
    //   },
    //   key: 'header.txTrieRoot'
    // }, {
    //   title: 'Witness',
    //   render: (text, record, index) => {
    //     return record.header.witness;
    //   },
    //   key: 'header.witness'
    // }];

    this.columnsTop = [
      {
        title: 'Name',
        dataIndex: 'name',
        render: (text, record, index) => {
          console.log(text, record)
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
        dataIndex: 'from'
      },{
        title: 'To',
        dataIndex: 'to'
      },{
        title: 'Amount',
        dataIndex: 'amount'
      }
    ]
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('handleTableChange', pagination, filters, sorter);

    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    // this.setState({
    //   pagination: pager,
    // });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }

  fetch = (params = {}) => {
    console.log('params:', params);
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
      console.log(data);
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 1;

      let dataTop = [];
      let dataBottom = [];
      Object.keys(data.header).forEach((key) => {
        dataTop.push({
          name: key,
          value: data.header[key]
        })
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

  render() {
    return (<div>
      {<Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{this.state.hash || ''}</Breadcrumb.Item>
      </Breadcrumb>}
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
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
          rowKey={record => record.amount}
          pagination={this.state.pagination}
          loading={this.state.loading}
          size="small"
          // onChange={this.handleTableChange} 
        />
      </div>
    </div>);
  }
}

export default List;
