import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import JoinGame from './joinGame';
import Username from './username';

import './login.scss';

const Login = (): JSX.Element => {
  const [loggedin, setLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get('userName')) {
      setLoggedIn(true);
    }
  });

  return !loggedin ? <Username /> : <JoinGame />;
};

export default Login;
