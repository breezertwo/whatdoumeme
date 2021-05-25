import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useConnection from '../../hooks/useConnection';
import GameView from './gameview';
import Lobby from './lobby';

enum STATES {
  WAITING = 0,
  STARTED = 1,
  COMITTED = 2,
  ANSWERS = 3,
}

const Home = (): JSX.Element => {
  const [state, setState] = useState(STATES.WAITING);
  const { roomId } = useParams<any>();

  const {
    roundData,
    playersData,
    serverState,
    startGame,
    leaveGame,
  } = useConnection(roomId);

  const onCardClicked = (id: string) => {
    console.log(id);
  };

  useEffect(() => {
    setState(serverState);
  }, [serverState]);

  switch (state) {
    case STATES.WAITING:
      return (
        <Lobby
          players={playersData}
          onStartClick={startGame}
          onLeaveClick={leaveGame}
        />
      );
    case STATES.STARTED:
      return <GameView roundData={roundData} onCardClicked={onCardClicked} />;
    default:
      return <p>FAIL</p>;
  }
};

export default Home;
