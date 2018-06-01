import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import List from '../components/page_list';
import Header from '../components/header';
import Footer from '../components/footer';
import Config from '../utils/config';
import { Link } from 'dva/router';


const { Content } = Layout;
const serverHost = Config.host;

function IndexPage() {
  return (<Layout className="layout">
    <Header></Header>
    <Content>
      {/* <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>List</Breadcrumb.Item>
      <Breadcrumb.Item>App</Breadcrumb.Item>
    </Breadcrumb> */}
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
        <List
          search={true}
          pagination={true}
          searchPlaceholder="Height or ID"
          rowKey={record => record.header.height}
          columns={[{
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
          }]}
          fetchUrl={(params) => {
            return serverHost + '/v1/blocks/page/' + params.pageIndex
          }}
          fetchCallback={(params, prevData, data) => {
            const prevHeight = prevData[0] ? prevData[0].header.height : 0;

            data.forEach((d, index) => {
              if (d.header.height > prevHeight) {
                d.isNew = true;
              }
            })
            return data;
          }}
          searchUrl={() => {
            return serverHost + '/v1/block/search';
          }}
          searchCallback={(data) => {
            return window.location.hash = '#/block/' + data.header.height + Config.search;
          }} />
      </div>
    </Content>
    <Footer />
  </Layout>)
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
