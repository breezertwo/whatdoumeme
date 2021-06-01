import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import useConnection from '../../hooks/useConnection';
import LoadingSpinner from '../common/loadingSpinner';
import Lobby from './lobby';
import { CzarView, GameView } from './views';
import { STATES } from '../../interfaces/api';

interface ParamTypes {
  roomId: string;
}

const Home = (): JSX.Element => {
  const [selectedCardId, setSelectedCard] = useState<string>(null);
  const { roomId } = useParams<ParamTypes>();

  const {
    roundData,
    playersData,
    serverState,
    startGame,
    leaveGame,
    confirmCard,
    confirmMeme,
  } = useConnection(roomId);

  const onCardClicked = (id: string) => {
    console.log(id);
    setSelectedCard(id);
  };

  switch (serverState) {
    case STATES.WAITING:
      return <Lobby players={playersData} onStartClick={startGame} onLeaveClick={leaveGame} />;
    case STATES.STARTED:
      return (
        <GameView
          roundData={roundData}
          onConfirmClicked={() => confirmCard(selectedCardId)}
          onCardClicked={onCardClicked}
          onLeaveClick={leaveGame}
        />
      );
    case STATES.MEMELORD:
      return (
        <CzarView
          roundData={roundData}
          onConfirmClicked={() => confirmMeme(selectedCardId)}
          onCardClicked={onCardClicked}
        />
      );
    case STATES.COMITTED:
      return <p>COMITTED</p>;
    case STATES.LOADING:
      return <LoadingSpinner msg={'Game is loading...'} />;
    default:
      return <p>FAIL</p>;
  }
};

export default Home;
