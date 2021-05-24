import Cookies from 'js-cookie';
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
  const [state, setState] = useState(STATES.STARTED);
  const { roomId } = useParams<any>();

  const { roundData, playersData, serverState, leaveGame } = useConnection(
    roomId
  );

  const onCardClicked = (id: number) => {
    console.log(id);
  };

  useEffect(() => {
    setState(serverState);
  }, [serverState]);

  const getViewByState = (state: number): JSX.Element => {
    switch (state) {
      case STATES.WAITING:
        return <Lobby players={playersData} onLeaveClick={leaveGame} />;
      case STATES.STARTED:
        return <GameView roundData={roundData} onCardClicked={onCardClicked} />;
      default:
        return <p>FAIL</p>;
    }
  };
  return getViewByState(state);
};

export default Home;
