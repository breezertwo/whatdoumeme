import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useConnection from '../../hooks/useConnection';
import LoadingSpinner from '../common/loadingSpinner';
import { CzarView, GameView, CommittedView, Lobby, WinnerView, EndScreenView } from './views';
import { TabBar, TabPanel } from './views/subviews';
import { STATES } from '../../interfaces/api';
import { ScoreBoard } from '../scoreboard/scoreBoard';
import { ActionsView } from '../actionmenue/actionmenue';

interface ParamTypes {
  roomId: string;
}

const Home = (): JSX.Element => {
  const [selectedCardId, setSelectedCard] = useState<string>(null);
  const [value, setValue] = useState(0);
  const { roomId } = useParams<ParamTypes>();

  const {
    roundData,
    playersData,
    serverState,
    startGame,
    leaveGame,
    confirmCard,
    confirmMeme,
    tradeInWin,
  } = useConnection(roomId);

  const onCardClicked = (id: string): void => {
    console.log(id);
    setSelectedCard(id);
  };

  const handleTabChange = (newValue: number): void => {
    setValue(newValue);
  };

  const handleConfirmCard = (): void => {
    confirmCard(selectedCardId);
    setSelectedCard(null);
  };

  const handleConfirmMeme = (): void => {
    confirmMeme(selectedCardId);
    setSelectedCard(null);
  };

  const getViewByState = (): JSX.Element => {
    switch (serverState) {
      case STATES.WAITING:
        return <Lobby players={playersData} onStartClick={startGame} onLeaveClick={leaveGame} />;
      case STATES.STARTED:
      case STATES.ANSWERS:
        return (
          <GameView
            roundData={roundData}
            onConfirmClicked={handleConfirmCard}
            onCardClicked={onCardClicked}
            onLeaveClick={leaveGame}
          />
        );
      case STATES.MEMELORD:
        return (
          <CzarView
            roundData={roundData}
            onConfirmClicked={handleConfirmMeme}
            onCardClicked={onCardClicked}
            onLeaveClick={leaveGame}
          />
        );
      case STATES.WINNER:
        return <WinnerView roundData={roundData} />;
      case STATES.COMITTED:
        return <CommittedView memeURL={roundData.randomMeme} />;
      case STATES.END:
        return <EndScreenView playerData={playersData} onRestart={startGame} onLeave={leaveGame} />;
      case STATES.LOADING:
        return <LoadingSpinner msg={'Game is loading...'} />;
      default:
        return <p>FAIL</p>;
    }
  };

  return serverState !== STATES.END ? (
    <>
      <TabBar serverState={serverState} handleChange={handleTabChange} />
      <TabPanel value={value} index={0}>
        {getViewByState()}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ScoreBoard playerData={playersData} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ActionsView playerData={playersData} serverState={serverState} onTradeIn={tradeInWin} />
      </TabPanel>
    </>
  ) : (
    getViewByState()
  );
};

export default Home;
