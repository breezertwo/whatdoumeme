import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Username = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const history = useHistory();

  const handleUserameChange = (event) => {
    setUsername(event.target.value);
  };

  const onClick = () => {
    Cookies.set('userName', username);
    history.push(`/`);
  };

  return (
    <div className="loginContainer">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUserameChange}
        className="textInput"
      />
      <div onClick={onClick} className="enterRoomBtn">
        Set username
      </div>
    </div>
  );
};

export default Username;
