import { Switch, Route, MemoryRouter } from 'react-router-dom';

import Home from './gamescreen/mainView';
import { PageHeader } from './header';
import Login from './login/login';

import './../assets/scss/App.scss';

const App = (): JSX.Element => {
  return (
    <div className="app">
      <PageHeader />
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

export default App;
