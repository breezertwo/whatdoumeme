import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CustomButton } from '../gamescreen/views/subviews';
import { useLoginStyles } from './login';

const JoinGame = (): JSX.Element => {
  const [roomName, setRoomName] = useState('');
  const history = useHistory();
  const classes = useLoginStyles();

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  useEffect(() => {
    const c = Cookies.get('roomId');
    if (c) {
      history.push(`room/${c}`);
    }
  }, []);

  const createRoom = () => {
    history.push('room/:create');
  };

  const joinRoom = () => {
    history.push(`room/${roomName}`);
  };
  return (
    <div className={classes.loginContainer}>
      <CustomButton onClick={createRoom}>Create game</CustomButton>
      <input
        type="text"
        placeholder="Room"
        value={roomName}
        onChange={handleRoomNameChange}
        className={classes.textInput}
      />
      <CustomButton onClick={joinRoom}>Join Game</CustomButton>
    </div>
  );
};

export default JoinGame;
