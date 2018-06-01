import React from 'react';
import reqwest from 'reqwest';

// import Config from '../utils/config';

// const { Content } = Layout;
// const serverHost = Config.host;

class Nodes extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={{ background: '#03041a', height: 800, position: 'relative' }} id="canvas">
        <div className="load-3">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>);
  }

  componentDidMount() {
    this.initEcharts();
  }

  componentWillUnmount() {
    this.chart && this.chart.dispose();
    this.chart = null;
  }

  initEcharts() {
    reqwest({
      url: 'https://api.tronscan.org/api/node',
      type: 'json',
    }).then((data) => {
      if (data && data.nodes) {
        data = data.nodes.map(function (dataItem) {
          const _val = Math.random(0, 1) * 60;
          return {
            name: dataItem.city,
            decrease: _val >= 60 ? true : false,
            value: [dataItem.lng, dataItem.lat, _val]
          }
        });
        this.data = data;
        this.chart = _init(data);
      }
      /*
      setTimeout(() => {
        this.updateData();
      }, 2000);*/
    }).fail(() => {
      // alert('not found');
    });


    function _init(data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = window.echarts.init(document.getElementById('canvas'));

      const option = {
        visualMap: {
          show: false,
          min: 0,
          max: 60,
          inRange: {
            symbolSize: [1.0, 30.0],
            color: ['#010103', '#2f490c', '#b0b70f', '#fdff44', '#fff'],
            colorAlpha: [0.2, 1]
          }
        },
        globe: {

          // environment: '/src/assets/starfield.jpg',
          environment: '#03041a',

          heightTexture: '/src/assets/bathymetry_bw_composite_4k.jpg',

          displacementScale: 0.05,
          displacementQuality: 'high',

          globeOuterRadius: 100,

          baseColor: '#000',

          shading: 'realistic',
          realisticMaterial: {
            roughness: 0.2,
            metalness: 0
          },

          postEffect: {
            enable: true,
            depthOfField: {
              enable: false,
              focalDistance: 150
            }
          },
          temporalSuperSampling: {
            enable: true
          },
          light: {
            ambient: {
              intensity: 0
            },
            main: {
              intensity: 0.1,
              shadow: false
            },
            ambientCubemap: {
              texture: '/src/assets/lake.hdr',
              // texture: 'data-gl/src/assets/lake.hdr',
              exposure: 1,
              diffuseIntensity: 0.5,
              specularIntensity: 2
            }
          },
          viewControl: {
            autoRotate: true,
            beta: 180,
            alpha: 20,
            distance: 200
          },
        },
        series: {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          blendMode: 'lighter',
          symbolSize: 2,
          label: { formatter: (params) => { return params.name; } },
          symbol: 'pin',
          itemStyle: {
            // color: 'red',
            // borderColor: '#fff',
            // opacity: 0.5
          },
          // animationDurationUpdate: 3000,
          data: data
        }
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      return myChart;
    }

  }
}

export default Nodes;