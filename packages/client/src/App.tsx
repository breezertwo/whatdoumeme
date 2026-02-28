import { Routes, Route, MemoryRouter } from 'react-router-dom';

import { PageHeader } from './components/header';
import Login from './components/login/login';
import { UsernameProvider } from './context/username';

import './assets/scss/App.scss';
import { Home } from './screens/Home';

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
