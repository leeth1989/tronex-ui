import React from 'react';
import reqwest from 'reqwest';
import merge from 'lodash/merge';
// import Config from '../utils/config';

// const serverHost = Config.host;

class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.initEcharts = this.initEcharts.bind(this);
    this.id = 'canvas-pie' + Math.floor(Math.random(0, 1) * 5000);

  }

  shouldComponentUpdate(p1, p2) {
    return false;
  }

  render() {
    return (
      <div style={{background: 'transparent'}}>
        {this.props.title ? 
        <div style={{
          color: '#222339',
          // color: 'RGBA(64, 89, 82, 1.00)',
          textAlign: 'center',
          textShadow: '0 0 1px RGBA(26, 188, 156, 0.2)',
          paddingTop: 10,
        }}>{this.props.title}</div> : null}
        <div style={{ background: 'transparent', height: 300, position: 'relative'}} id={this.id}>
            <div className="load-3">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
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
/*
  updateData() {
    this.data = this.data.map(function (dateItem) {
      let _val = dateItem.value[2], _decrease;
      if (dateItem.decrease) {
        if (_val - 10 < 0) {
          _val = 0;
          _decrease = false;
        } else {
          _val -= 10;
          _decrease = true;
        }
      } else {
        if (_val + 10 > 60) {
          _val = 60;
          _decrease = true;
        } else {
          _val += 10;
          _decrease = false;
        }
      }
      return {
        name: dateItem.city,
        decrease: _decrease,
        value: [dateItem.value[0], dateItem.value[1], _val]
      }
    })
    this.chart.setOption({
      series: {
        data: this.data
      }
    })
    setTimeout(() => {
      this.updateData();
    }, 1000);
  }*/

  _init() {
    // 基于准备好的dom，初始化echarts实例
    const ele = document.getElementById(this.id);
    if (ele) {
      return window.echarts.init(ele);
    } else {
      return null;
    }

    // const option = this.props.options;

    // 使用刚指定的配置项和数据显示图表。
    // myChart.setOption(option);
  }

  initEcharts() {
    reqwest({
      url: this.props.url,
      crossOrigin: true,
      // url: 'https://api.tronscan.org/api/node',
      type: 'json',
    }).then((data) => {
      this.data = this.props.handleData(data);
      if (this.data) this.done = true;
      if (!this.chart) this.chart = this._init(data);
      this.chart && this.chart.setOption(merge({}, this.props.options, this.data));      
      /*
      setTimeout(() => {
        this.updateData();
      }, 2000);*/
    }).fail((err) => {
      console.error(err);
    });
  }
}

export default Charts;