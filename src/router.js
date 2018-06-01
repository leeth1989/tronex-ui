import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import DetailPage from './routes/Detail';
import AddressPage from './routes/Address';
import AccountsPage from './routes/Accounts';
import Nodes from './routes/nodes';
import Blocks from './routes/BlocksPage';
import Witness from './routes/WitnessPage';

// window.addEventListener('resize', function () {
//   window.location.reload();
// })


function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/blocks" exact component={Blocks} />
        <Route path="/accounts" exact component={AccountsPage} />
        <Route path="/block/:id" exact component={DetailPage} />
        <Route path="/account/:addr" exact component={AddressPage} />
        <Route path="/nodes" exact component={Nodes} />
        <Route path="/witness" exact component={Witness} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
