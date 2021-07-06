import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route, MemoryRouter } from 'react-router-dom';

import './../assets/scss/App.scss';
import Home from './gamescreen/mainView';
import Login from './login/login';

const App = (): JSX.Element => {
  return (
    <div className="app">
      <div className="page-header">
        <h1>what do u meme</h1>
      </div>
      <div className="page-main">
        <MemoryRouter>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/room/:roomId" component={Home} />
          </Switch>
        </MemoryRouter>
      </div>
    </div>
  );
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
