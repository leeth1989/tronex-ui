import React from 'react';
import reqwest from 'reqwest';
// import merge from 'lodash/merge';
import Odometer from 'odometer';
// import Config from '../utils/config';

// const serverHost = Config.host;

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.id = 'number-board-' + Math.floor(Math.random(0, 1) * 5000);
  }

  shouldComponentUpdate(p1, p2) {
    return false;
  }

  render() {
    return (
      <div style={{background: 'transparent', textAlign: 'center'}}>
        {this.props.title ? 
        <div style={{
          color: '#222339',
          textAlign: 'center',
          textShadow: '0 0 1px RGBA(26, 188, 156, 0.2)',
          paddingTop: 10,
          fontSize: 20,
          duration: 2500

        }}>{this.props.title}</div> : null}
        <div id={this.id} className="board-odo"></div>
      </div>);
  }

  _init() {
    // 基于准备好的dom，初始化echarts实例
    const ele = document.getElementById(this.id);
    if (ele) {
      this.board = new Odometer({
        el: ele,
        value: 0,
        // Any option (other than auto and selector) can be passed in here
        format: this.props.format,
        // format: '(,ddd).dd',
        theme: 'plaza'
      });
      
      // this.board.update(555);
      // console.log(this.board)
    }
  }

  componentDidMount() {
    this._init();
    this.fetch();
  }

  componentWillUnmount() {
    this.chart = null;
    this.timer && clearTimeout(this.timer);
  }

  fetch() {
    this.timer && clearTimeout(this.timer);
    reqwest({
      url: this.props.url,
      crossOrigin: true,
      // url: 'https://api.tronscan.org/api/node',
      type: 'json',
    }).then((data) => {
      const value = this.props.handleData(data);
      if (value) this.board.update(value);
      
      this.timer = setTimeout(() => {
        this.fetch();
      }, 3000);
    }).fail((err) => {
      this.timer = setTimeout(() => {
        this.fetch();
      }, 3000);
    });
  }
}

export default Board;