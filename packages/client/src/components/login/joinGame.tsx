import Cookies from 'js-cookie';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../gamescreen/views/subviews';

const JoinGame = () => {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  useEffect(() => {
    const c = Cookies.get('roomId');
    if (c) {
      navigate(`room/${c}`);
    }
  }, []);

  const createRoom = () => {
    navigate('room/:create');
  };

  const joinRoom = () => {
    navigate(`room/${roomName}`);
  };

  return (
    <div className="login-container">
      <CustomButton onClick={createRoom}>Create game</CustomButton>
      <input type="text" placeholder="Room" value={roomName} onChange={handleRoomNameChange} className="text-input" />
      <CustomButton onClick={joinRoom}>Join Game</CustomButton>
    </div>
  );
};

export default JoinGame;
