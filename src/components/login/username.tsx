import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CustomButton } from '../gamescreen/views/subviews';
import { useLoginStyles } from './login';

const Username = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const history = useHistory();
  const classes = useLoginStyles();

  const handleUserameChange = (event) => {
    setUsername(event.target.value);
  };

  const onClick = () => {
    Cookies.set('userName', username);
    history.push(`/`);
  };

  return (
    <div className={classes.loginContainer}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUserameChange}
        className={classes.textInput}
      />
      <CustomButton onClick={onClick}>Set username</CustomButton>
    </div>
  );
};

export default Username;
