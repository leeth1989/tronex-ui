import React from 'react';
import { connect } from 'dva';
// import './IndexPage.css';
import {Layout} from 'antd';
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
        searchPlaceholder="Account"
        rowKey={record => record.address}
        columns={[{
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (text, record, index) => {
              return <Link to={`/account/${record.address}${Config.search}`}>{record.address}</Link>;
            },
          }, {
            title: 'Account Type',
            render: (text, record, index) => {
              return record.accountType;
            },
            key: 'accountType',
          }, {
            title: 'Balance',
            render: (text, record, index) => {
              return record.balance;
            },
            key: 'balance',
          }]}
        fetchUrl={(params) => {
          return serverHost + '/v1/accounts/page/' + params.pageIndex
        }}
        fetchCallback={(params, prevData, data) => {
          return data;
        }}
        searchUrl={() => {
          return serverHost + '/v1/accounts/search';
        }}
        searchCallback={(data) => {
          return window.location.hash = '#/account/' + data.header.height + Config.search;
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
