import { Table, Divider, Icon} from 'antd';
import React from 'react';
import reqwest from 'reqwest';
import { Link } from 'dva/router';
import {Breadcrumb } from 'antd';
import Config from '../utils/config';

// const ButtonGroup = Button.Group;



const nameMap = {
  'accountName': 'Account Name',
  'accountType': 'Account Type',
  'address': 'Address',
  'balance': 'Balance',
  'bandwidth': 'Bandwidth',
  'committee': 'Is Committee',
  'witness': 'Is Witness',
  'createTime': 'Create Time',
  'latestOperationTime': 'Latest Operation Time',
  'latestWithdrawTime': 'Latest Withdraw Time',
  'netUsage': 'Net Usage'
}

const serverHost = Config.host;

class List extends React.Component {
  constructor(props) {
    console.log('constructor', props.id)
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
        width: 200
      },
      {
        title: 'Value',
        dataIndex: 'value',
        render: (text, record, index) => {
          if (typeof record.value === 'boolean') {
            return record.value ? <Icon type="check" style={{color: 'RGBA(26, 188, 156, 1.00)'}}/> : <Icon type="close" style={{color:'RGBA(231, 76, 60, 1.00)'}} />;
          } else {
            return record.value
          }
        }
      }
    ]

    this.columnsAsset = [
      {
        title: 'Name',
        dataIndex: 'name',
        render: (text, record, index) => {
          return nameMap[text] || text;
        },
        align: 'right',
        width: 200
      },
      {
        title: 'Value',
        dataIndex: 'value'
      }
    ]

    this.columnsBottom = [
      {
        title: 'Vote Address',
        dataIndex: 'voteAddress',
        width: 350
      },{
        title: 'Vote Count',
        dataIndex: 'voteCount',
        align: 'left'
      }
    ]
  }


  componentDidUpdate() {
    console.log('componentDidUpdate',this.props.id, this.id)
    if (this.props.id !== this.id) {
      this.fetch();
      this.id = this.props.id;
    }
    // this.fetch(this.props.id);
  }

  fetch = (params = {}) => {
    console.log('params:', params, this.props.id);
    this.setState({ loading: true });
    reqwest({
      url: serverHost + '/v1/accounts/' + this.props.id,
      // method: 'get',
      // data: {
      //   results: 10,
      //   ...params,
      // },
      type: 'json',
    }).then((data) => {
      console.log(data);

      let dataTop = [];
      let dataAsset = [];
//      let dataBottom = [];
      
      // dataTop.push({
      //   name: 'id',
      //   value: data['id']
      // });

      Object.keys(data).forEach((key) => {
        if (!/^(asset|votes)$/.test(key) && typeof data[key] !== 'object') {
          dataTop.push({
            name: key,
            value: data[key]
            // value: typeof data[key] === 'boolean' ? data[key] + '' : data[key]
          })
        }
      });

      Object.keys(data.asset).forEach((key) => {
        dataAsset.push({
          name: key,
          value: data.asset[key]
        })
      });
      

      // data.txs.forEach((obj) => {
      //   obj.contractList.forEach((_obj) => {
      //     if (_obj) dataBottom.push(_obj)
      //   })
      // })
      this.setState({
        loading: false,
        address: data.address,
        dataTop: dataTop,
        dataAsset: dataAsset,
        dataBottom: data.votes
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
        <Breadcrumb.Item>{this.state.address || ''}</Breadcrumb.Item>
      </Breadcrumb>}
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
      {/* <Row>
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
      </Row> */}
        <Divider orientation="left">Address</Divider>
        <Table 
          dataSource={this.state.dataTop} 
          columns={this.columnsTop} 
          rowKey={record => record.name}
          pagination={false}
          loading={this.state.loading}
          showHeader={false}
          size="middle"
          rowClassName="detail-row"
          // onChange={this.handleTableChange} 
        />
        <Divider orientation="left">Asset</Divider>
        <Table 
          dataSource={this.state.dataAsset} 
          columns={this.columnsAsset} 
          rowKey={record => record.name}
          pagination={false}
          loading={this.state.loading}
          showHeader={false}
          size="middle"
          rowClassName="detail-row"
          // onChange={this.handleTableChange} 
        />
        <Divider orientation="left">Votes</Divider>
        <Table 
          dataSource={this.state.dataBottom} 
          columns={this.columnsBottom} 
          rowKey={record => Math.floor(Math.random(0,1) * 10000)}
          pagination={false}
          loading={this.state.loading}
          showHeader={false}
          size="small"
          rowClassName="detail-row"
          // onChange={this.handleTableChange} 
        />
        {/* <Table 
          dataSource={this.state.dataBottom} 
          columns={this.columnsBottom} 
          rowKey={record => Math.floor(Math.random(0,1) * 10000)}
          pagination={false}
          loading={this.state.loading}
          size="small"
          /> */}
      </div>
    </div>);
  }
}

export default List;
