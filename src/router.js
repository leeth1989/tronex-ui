import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import DetailPage from './routes/Detail';
import AddressPage from './routes/Address';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/block/:id" exact component={DetailPage} />
        <Route path="/address/:addr" exact component={AddressPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
