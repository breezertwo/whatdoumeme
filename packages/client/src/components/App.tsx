import { Routes, Route, MemoryRouter } from 'react-router-dom';

import Home from './gamescreen/mainView';
import { PageHeader } from './header';
import Login from './login/login';
import { UsernameProvider } from '../context/username';

import './../assets/scss/App.scss';

const App = () => {
  return (
    <UsernameProvider>
      <div className="app">
        <PageHeader />
        <div className="page-main">
          <MemoryRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/room/:roomId" element={<Home />} />
            </Routes>
          </MemoryRouter>
        </div>
      </div>
    </UsernameProvider>
  );
};

export default App;
