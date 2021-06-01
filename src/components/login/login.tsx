import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import JoinGame from './joinGame';
import Username from './username';
import { makeStyles } from '@material-ui/core';

export const useLoginStyles = makeStyles({
  loginContainer: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 500,
  },
  textInput: {
    padding: '24px 12px',
    borderRadius: 7,
    fontSize: 24,
    margin: '30px 0 10px 0',
    '&:focus': {
      outline: 'none',
    },
  },
});

const Login = (): JSX.Element => {
  const [loggedin, setLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get('userName')) {
      setLoggedIn(true);
    }
  });

  return loggedin ? <JoinGame /> : <Username />;
};

export default Login;
