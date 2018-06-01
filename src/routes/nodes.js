import React from 'react';
import { connect } from 'dva';
import { Layout , Icon} from 'antd';

import Header from '../components/header';
import Footer from '../components/footer';
// import Config from '../utils/config';
import Globe from '../components/globe';
import List from '../components/page_list';

const { Content } = Layout;
// const serverHost = Config.host;

class Nodes extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        key: 'ip',
        dataIndex: 'ip',
        title: 'IP'
      }
    ];
    this.state = {
      nodes: []
    };
  }

  render() {
    return (<Layout className="layout">
      <Header></Header>
      <Content>
        <Globe/>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <List 
            search={false}
            pagination={false}
            rowKey={record => record.ip}
            columns={[{
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip',
                // width: 400
              }, {
                title: 'City',
                dataIndex: 'city',
                key: 'city',
                // width: 400
              }, {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
                // width: 400
              // }, {
              //   title: 'Node Type',
              //   dataIndex: 'nodeType',
              //   key: 'nodeType',
              //   // width: 400
              }, {
                title: 'Grpc Enabled',
                dataIndex: 'grpcEnabled',
                key: 'grpcEnabled',
                render: (text, record, index) => {
                  if (typeof record.grpcEnabled === 'boolean') {
                    return record.grpcEnabled ? <Icon type="check" style={{color: 'RGBA(26, 188, 156, 1.00)'}}/> : <Icon type="close" style={{color:'RGBA(231, 76, 60, 1.00)'}} />;
                  } else {
                    return record.grpcEnabled
                  }
                }
                // width: 400
              }, {
                title: 'Port',
                dataIndex: 'port',
                key: 'port',
                // width: 400
              }]}
            fetchUrl={(params) => {
              return 'https://api.tronscan.org/api/node';
            }}
            fetchCallback={(params, prevData, data) => {
              if (data && data.nodes) return data.nodes;
            }}
          />
        </div>
      </Content>
      <Footer />
    </Layout>);
  }
}

export default connect()(Nodes);
