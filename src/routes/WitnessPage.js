import React from 'react';
import { connect } from 'dva';
// import './IndexPage.css';
import {Layout, Icon} from 'antd';
import List from '../components/page_list';
import Header from '../components/header';
import Footer from '../components/footer';
import Config from '../utils/config';
import { Link } from 'dva/router';

const {Content} = Layout;
const serverHost = Config.host;

function AccountsPage() {
  return (<Layout className="layout">
  <Header></Header>
  <Content >
    {/* <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>List</Breadcrumb.Item>
      <Breadcrumb.Item>App</Breadcrumb.Item>
    </Breadcrumb> */}
    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
      <List 
        search={false}
        pagination={false}
        rowKey={record => record.address}
        columns={[{
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (text, record, index) => {
              return <Link to={`/account/${record.address}${Config.search}`}>{record.address}</Link>;
            },
            width: 400
          },
          {
            title: 'Url',
            dataIndex: 'url',
            key: 'url',
            render: (text, record, index) => {
              return <a href={record.url} target="_blank">{record.url}<Icon type="export" /></a>;
            },
          },
          {
            title: 'Vote Count',
            dataIndex: 'voteCount',
            key: 'voteCount',
            render: (text, record, index) => {
              return record.voteCount;
            },width: 150
          },
          {
            title: 'Total Produced',
            dataIndex: 'totalProduced',
            key: 'totalProduced',
            render: (text, record, index) => {
              return record.totalProduced;
            },width: 150
          },
          {
            title: 'Success Rate',
            dataIndex: 'totalMissed',
            key: 'totalMissed',
            render: (text, record, index) => {
              let val = 100 * parseInt(record.totalProduced) / (parseInt(record.totalProduced) + parseInt(record.totalMissed));
              if (isNaN(val)) return '--';
              
              return (val.toFixed(2) + '%');
            },width: 150
          },
          {
            title: 'Latest Block',
            dataIndex: 'latestBlockNum',
            key: 'latestBlockNum',
            render: (text, record, index) => {
              return <Link to={`/block/${record.latestBlockNum}${Config.search}`}>{record.latestBlockNum}</Link>;
            },width: 150
          }]}
        fetchUrl={(params) => {
          return serverHost + '/v1/nodes/witness';
        }}
        fetchCallback={(params, prevData, data) => {
          return data;
        }}
      />
    </div>
  </Content>
  <Footer/>
</Layout>)
}

AccountsPage.propTypes = {
};

export default connect()(AccountsPage);
