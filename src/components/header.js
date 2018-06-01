import React from 'react';
import {Layout, Input} from 'antd';
import { Link, Route } from 'dva/router';
import Config from '../utils/config';
import reqwest from 'reqwest';

const { Header} = Layout;
const Search = Input.Search;


class H extends React.Component {
  search(value) {
    reqwest({
      url: '' + Config.host + '/v1/block/search',
      data: {
        q: value
      },
      type: 'json',
    }).then((data) => {
      if (data) {
        return window.location.hash = '#/block/' + data.header.height + Config.search;
      }
    }).fail(() => {
      alert('not found');
    });
  }

  render() {
    return (
      <Header style={{
      }}>
        <ul className="header-menu">
          
          <Menu label="Blocks" to={`/blocks${Config.search}`} />
          <Menu label="Witness" to={`/witness${Config.search}`} />
          <Menu label="Nodes" to={`/nodes${Config.search}`} />
          <li style={{paddingLeft: 10}}>
            <Search placeholder={"Height or ID"} onSearch={this.search.bind(this)} enterButton className="search-bar" />
          </li>
        </ul>
        <div className="logo" ><Link to={`/${Config.search}`}>TronEx</Link></div>
  
      </Header>);
  }
}

H.propTypes = {
};

const Menu = ({ label, to, activeOnlyWhenExact }) => (
  <li className="">
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match}) => (
       (<div className={check(to) ? "header-menu-item active" : "header-menu-item"}>
        {match ? "> " : ""}
        <Link to={to}>{label}</Link>
      </div>)
    )}
  /></li>
);

const check = (to) => {
  let r = window.location.hash.replace(/^#/, '').split('?')[0].split('/');
  let t = to.split('?')[0].split('/');
  // if (r[0] == '/' && r[0] == t[0]) return true;
  return r[1] == t[1];
}

export default H;

