import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
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

  return (
    <div className={classes.loginContainer}>
      <CustomButton>
        <Link to={`room/:create`}>Create game</Link>
      </CustomButton>
      <input
        type="text"
        placeholder="Room"
        value={roomName}
        onChange={handleRoomNameChange}
        className={classes.textInput}
      />
      <CustomButton>
        <Link to={`room/${roomName}`}>Join game</Link>
      </CustomButton>
    </div>
  );
};

export default JoinGame;
