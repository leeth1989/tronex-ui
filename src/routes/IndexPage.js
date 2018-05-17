import React from 'react';
import { connect } from 'dva';
import './IndexPage.css';
import {Layout, Menu, Breadcrumb } from 'antd';
import List from '../components/page_list';
import Header from '../components/header';
import Footer from '../components/footer';

const {Content} = Layout;

function IndexPage() {
  return (<Layout className="layout">
  <Header></Header>
  <Content style={{ padding: '0 50px' }}>
    {/* <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>List</Breadcrumb.Item>
      <Breadcrumb.Item>App</Breadcrumb.Item>
    </Breadcrumb> */}
    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
      <List/>
    </div>
  </Content>
  <Footer/>
</Layout>)
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
