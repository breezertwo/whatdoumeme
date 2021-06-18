import * as React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

import App from './components/App';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#31a24c',
    },
    secondary: {
      main: '#2e7031',
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
