import React from 'react';
import { connect } from 'dva';
import Header from '../components/header';
import {Layout } from 'antd';
import Footer from '../components/footer';
// import { Link } from 'dva/router';
//import DetailTable from '../components/detail_table';
import AddressTable from '../components/address_table';
//import './Detail.css';

const {Content} = Layout;

function Address({ match }) {
  console.log(match)
  return (<Layout className="layout">
    <Header></Header>
    <Content style={{ padding: '0 50px' }}>
      {/* {<Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{match.params.id}</Breadcrumb.Item>
      </Breadcrumb>} */}
      {/* <div style={{ background: '#fff', padding: 24, minHeight: 280 }}> */}
        <AddressTable id={match.params.id}/>
      {/* </div> */}
    </Content>
    <Footer/>
  </Layout>);
}


export default connect()(Address);
