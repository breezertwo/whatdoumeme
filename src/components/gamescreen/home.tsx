import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useConnection from '../../hooks/useConnection';
import { STATES } from '../../interfaces/api';
import CzarView from './czarview';
import GameView from './gameview';
import Lobby from './lobby';

interface ParamTypes {
  roomId: string;
}

const Home = (): JSX.Element => {
  const [selectedCardId, setSelectedCard] = useState(null);
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
      return <div className="loader"></div>;
    default:
      return <p>FAIL</p>;
  }
};

export default Home;
