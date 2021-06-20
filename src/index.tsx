import * as React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core';

import App from './components/App';
import { mainTheme } from './components/gamescreen/views/styles';

ReactDOM.render(
  <ThemeProvider theme={mainTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
