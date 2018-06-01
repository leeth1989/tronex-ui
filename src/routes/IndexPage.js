import React from 'react';
import { connect } from 'dva';
import { Layout, Icon } from 'antd';
import List from '../components/page_list';
import Header from '../components/header';
import Footer from '../components/footer';
import Config from '../utils/config';
import { Link } from 'dva/router';
import Charts from '../components/charts';
import reqwest from 'reqwest';
import Board from '../components/board';

import './IndexPage.css';

const { Content } = Layout;
const serverHost = Config.host;
// const COUNTRY_AXIS = ["United States", "China", "Germany", "France", "India", "Hong Kong", "Netherlands", "Ireland", "Australia", "Italy", "Republic of Korea", "United Arab Emirates", "Canada", "United Kingdom", "Vietnam", "Thailand", "Peru", "Switzerland", "Bulgaria", "South Africa", "Republic of Lithuania", "Singapore", "Israel", "Mauritius", "Spain", "Slovenia", "Réunion"].slice(0, 5);
const Colors = ['RGBA(17, 66, 55, 1.00)', 'RGBA(26, 188, 156, 1.00)', 'RGBA(70, 137, 102, 1.00)', 'RGBA(40, 73, 7, 1.00)', 'RGBA(92, 131, 47, 1.00)', 'RGBA(143, 179, 89, 1.00)', 'RGBA(0, 163, 136, 1.00)', 'RGBA(64, 89, 82, 1.00)', 'RGBA(56, 37, 19, 1.00)', 'RGBA(54, 57, 66, 1.00)']

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetch();
  }

  fetch() {
    reqwest({
      url: 'https://api.coinmarketcap.com/v1/ticker/tronix/?convert=EUR',
      crossOrigin: true,
      // url: 'https://api.tronscan.org/api/node',
      type: 'json',
    }).then((data) => {
      if (data && data[0] && data[0].price_usd) {
        this.setState({
          price: data[0].price_usd
        });
      }
    }).fail((err) => {
      console.error(err);
    });
  }

  render() {
    return (<Layout className="layout">
    <Header></Header>
    <Content>
      {/* <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>List</Breadcrumb.Item>
      <Breadcrumb.Item>App</Breadcrumb.Item>
    </Breadcrumb> */}
      <div style={{ background: 'transparent', minHeight: 100, margin: '20px -10px', display: 'flex' }}>
        <div className="chart-item" style={{background:'RGBA(255, 240, 165, 1)', borderRadius: 4}}>
        <Board url={`${serverHost}/v1/stats/totaltxcount`} handleData={(data) => {
            if (data.totalTxCount) return data.totalTxCount;
          }} title={<span><Icon type="swap" /> Total Transactions</span>}/>
        </div>
        <div className="chart-item" style={{background:'RGBA(255, 240, 165, 1)', borderRadius: 4}}>
          <Board url="https://api.coinmarketcap.com/v1/ticker/tronix/?convert=EUR" handleData={(data) => {
            if (data && data[0] && data[0].price_usd) {
              return data[0].price_usd;
            }
          }} title={<span><Icon type="wallet" /> Current Price (USD)</span>} format="(,ddd).dddddd" />
          
        </div>
        <div className="chart-item" style={{background:'RGBA(255, 240, 165, 1)', borderRadius: 4}}>
          <Board url="https://api.tronscan.org/api/node" handleData={(data) => {
            if (data.nodes) return data.nodes.length
          }} title={<span><Icon type="global" /> Online Nodes</span>} />
        </div>
      </div>
      <div style={{ background: 'transparent', minHeight: 280, margin: '20px -10px', display: 'flex' }}>
        <div className="chart-item">
          <Charts title="Transactions per Hour" url={`${serverHost}/v1/stats/txcount`} handleData={(data) => {
            // console.log(data);return;
            const xAxisData = [];
            const valueData = [];
            data.forEach((dataItem) => {
              xAxisData.push(dataItem.time);
              valueData.push(dataItem.txcount);
            });
            
            return {
              xAxis: {
                type: 'category',
                data: xAxisData,
                silent: false,
                splitLine: {
                  show: false
                },
                axisLabel: {
                  interval: 0,
                  // rotate: 10,
                  align: 'center',
                  fontSize: 9,
                  color: 'RGBA(64, 89, 82, 1.00)',
                  formatter: function (a) {
                    let d = new Date(a);
                    return (d.getHours() > 9 ? d.getHours() : ('0' + d.getHours())) + ':00';
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'RGBA(164, 168, 163, 1.00)'
                  }
                }
              },
              series: [
                {
                  data: valueData
                }
              ]
            };
          }} options={{
            title: {
              show: false
            },
            legend: {
              show: false,
              data: ['bar'],
              align: 'left',
            },
            grid: {
              left: '18%',
              right: '5%',
              top: '10%',
              bottom: '10%'
            },
            toolbox: {
              show: false
            },
            tooltip: {},
            xAxis: {
              type: 'category',
              // data: COUNTRY_AXIS,
              silent: false,
              splitLine: {
                show: false
              },
              axisLabel: {
                interval: 0,
                align: 'center',
                fontSize: 9,
                color: 'RGBA(64, 89, 82, 1.00)'
              },
              axisLine: {
                lineStyle: {
                  color: 'RGBA(164, 168, 163, 1.00)'
                }
              }
            },
            yAxis: {
              axisLine: {
                lineStyle: {
                  color: 'RGBA(164, 168, 163, 1.00)'
                }
                // color: 'RGBA(164, 168, 163, 1.00)'

              },
              axisLabel: {
                color: 'RGBA(64, 89, 82, 1.00)'
              }
            },

            series: [{
              name: '',
              type: 'bar',
              barWidth: 30 / 2,
              // data: [],
              itemStyle: {
                barBorderRadius: 2,
                color: ['RGBA(26, 188, 156, 0.6)'],
                shadowBlur: 5,
                // shadowColor: '#000'
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
 
              animationDelay: function (idx) {
                return idx * 10;
              }
            }],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
              return idx * 5;
            }
          }} />
        </div>
        <div className="chart-item">
          {/* <div style={{
            color: '#222339',
            // color: 'RGBA(64, 89, 82, 1.00)',
            textAlign: 'center',
            textShadow: '0 0 1px RGBA(26, 188, 156, 0.2)',
            paddingTop: 10
          }}>{this.state.price ? `Price ${this.state.price} USD` : 'Average Price (USD)'}</div> */}
          <Charts title="Average Price (USD)" url="https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&limit=10" handleData={(data) => {
            //https://api.coinmarketcap.com/v1/ticker/tronix/?convert=EUR
            if (data && data.Response.toLowerCase() === 'success') {
              data = data.Data;
              let _data = [];
              let xAxisData = [];
              let count = 0;
              data.forEach((item) => {
                _data.push(item.close);
                let now = new Date(item.time * 1000);
                xAxisData.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
                count += item.close;
              })
              return {
                xAxis: {
                  data: xAxisData,
                },
                series: [
                  {
                    data: _data,
                    markLine: {
                      data: [[
                        {
                          // type: 'average',
                          symbolSize: 1,
                          x: '15%',
                          yAxis: count / xAxisData.length
                        },
                        {
                          // type: 'average',
                          symbolSize: 1,
                          x: '90%',
                          yAxis: count / xAxisData.length
                        }
                      ]]
                    }
                  }
                ]
              };
            }
            return {
              xAxisData: {
                data: []
              },
              series: [
                {
                  data: []
                }
              ]
            };
          }} options={{
            title: {
              show: false,
              textStyle: {
                align: 'center'
              }
            },
            legend: {
              show: false,
              data: ['bar'],
              align: 'left',
            },
            grid: {
              left: '12%',
              right: '5%',
              top: '10%'
            },
            toolbox: {
              show: false
            },
            tooltip: {},
            xAxis: {
              silent: false,
              splitLine: {
                show: false
              },
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                interval: 0,
                rotate: 45,
                fontSize: 9,
                color: 'RGBA(64, 89, 82, 1.00)'

              },
              axisLine: {
                lineStyle: {
                  color: 'RGBA(164, 168, 163, 1.00)'
                }
              }
            },
            yAxis: {
              axisLine: {
                lineStyle: {
                  color: 'RGBA(164, 168, 163, 1.00)'
                }
                // color: 'RGBA(164, 168, 163, 1.00)'

              },
              axisLabel: {
                color: 'RGBA(64, 89, 82, 1.00)'
              },
              max: function (value) {
                // return value.max;
                return Math.ceil(value.max * 1000) / 1000;

              },
              min: function (value) {
                return Math.floor(value.min * 1000) / 1000;
              }
            },
            series: [{
              name: '',
              type: 'line',
              // smooth:true,
              // symbol: 'none',
              // sampling: 'average',
              itemStyle: {
                normal: {
                  color: ['RGBA(26, 188, 156, 0.6)'],
                  // shadowBlur: 2,
                  // shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              lineStyle: {
                normal: {
                  color: ['RGBA(26, 188, 156, 0.6)'],
                  shadowBlur: 2,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              // areaStyle: {
              //     normal: {
              //         color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              //             offset: 0,
              //             color: 'rgb(255, 158, 68)'
              //         }, {
              //             offset: 1,
              //             color: 'rgb(255, 70, 131)'
              //         }])
              //     }
              // }
            }],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
              return idx * 5;
            }
          }} />
        </div>
        <div className="chart-item">
          <Charts title="Top Countries of Nodes" url="https://api.tronscan.org/api/node" handleData={(data) => {
            const countryMap = {};
            data.nodes.forEach((dataItem) => {
              if (!countryMap[dataItem.country]) {
                countryMap[dataItem.country] = {

                };
              }
              if (!countryMap[dataItem.country][dataItem.city]) {
                countryMap[dataItem.country][dataItem.city] = 0;
              }
              countryMap[dataItem.country][dataItem.city]++;
            })
            let _data = [];
            Object.keys(countryMap).forEach((key) => {
              let obj = {
                name: key,
                children: []
              };
              let count = 0;
              Object.keys(countryMap[key]).forEach((city) => {
                count += countryMap[key][city];
                obj.children.push({
                  name: city,
                  value: countryMap[key][city]
                })
              })
              obj.value = count;
              _data.push(obj);
            })
            return {
              series: [{
                type: 'treemap',
                leafDepth: 1,
                silent: false,
                label: {
                  textShadowBlur: 5,
                  textShadowColor: 'rgba(0, 0, 0, 1)'
                },
                width: '90%',
                height: '90%',
                nodeClick: false,
                drillDownIcon: '',
                breadcrumb: {
                  show: false
                },
                data: _data
              }],
            };
          }} options={{
            color: Colors,
            title: {
              show: false
            },
            legend: {
              show: false
            },
            grid: {
              left: '0',
              right: '0%',
              top: '0%',
              // bottom: '10%'
            },
            tooltip: {
              formatter: function (info) {
                var value = info.value;
                var name = info.name;
                return [
                  `${name}: ${value}`
                ].join('');
              }
            },
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
              return idx * 5;
            }
          }} />
        </div>
      </div>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>

        <List
          search={false}
          pagination={false}
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
  </Layout>);
  }
}


IndexPage.propTypes = {
};

export default connect()(IndexPage);
