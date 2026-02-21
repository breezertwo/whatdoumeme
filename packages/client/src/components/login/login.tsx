import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import JoinGame from './joinGame';
import Username from './username';
import { useUsername } from '../../context/username';

const Login = () => {
  const username = useUsername();

  console.log('Username:', username);

  return username ? <JoinGame /> : <Username />;
};

export default Login;
