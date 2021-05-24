import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const JoinGame = (): JSX.Element => {
  const [roomName, setRoomName] = useState('');
  const history = useHistory();

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  useEffect(() => {
    const c = Cookies.get('roomId');
    if (c) {
      history.push(`room/${c}`);
    }
  }, []);

  return (
    <div className="loginContainer">
      <Link to={'/create'} className="enterRoomBtn">
        Create game
      </Link>
      <input
        type="text"
        placeholder="Room"
        value={roomName}
        onChange={handleRoomNameChange}
        className="textInput"
      />
      <Link to={`room/${roomName}`} className="enterRoomBtn">
        Join game
      </Link>
    </div>
  );
};

export default JoinGame;
