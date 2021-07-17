import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useConnection from '../../hooks/useConnection';
import LoadingSpinner from '../common/loadingSpinner';
import { CzarView, GameView, Lobby, WinnerView, EndScreenView } from './views';
import { TabBar, TabPanel } from './views/subviews';
import { STATES } from '../../interfaces/api';
import { ScoreBoard } from '../scoreboard/scoreBoard';
import { ActionsView } from '../actionmenue/actionmenue';

interface ParamTypes {
  roomId: string;
}

const Home = (): JSX.Element => {
  const [selectedCardId, setSelectedCard] = useState<string>(null);
  const [activeTabId, setActiveTab] = useState(0);
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
    requestMemeUrl,
  } = useConnection(roomId);

  const onCardClicked = (id: string): void => {
    setSelectedCard(id);
  };

  const handleTabChange = (tabId: number): void => {
    setActiveTab(tabId);
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
            requestMemeUrl={requestMemeUrl}
          />
        );
      case STATES.MEMELORD:
        return (
          <CzarView
            roundData={roundData}
            onConfirmClicked={handleConfirmMeme}
            onCardClicked={onCardClicked}
            onLeaveClick={leaveGame}
            requestMemeUrl={requestMemeUrl}
          />
        );
      case STATES.WINNER:
        return <WinnerView roundData={roundData} />;
      case STATES.COMITTED:
        return (
          <LoadingSpinner
            requestMemeUrl={requestMemeUrl}
            msg={'Committed. Waiting for the others...'}
          />
        );
      case STATES.END:
        return <EndScreenView playerData={playersData} onRestart={startGame} onLeave={leaveGame} />;
      case STATES.LOADING:
        return <LoadingSpinner requestMemeUrl={requestMemeUrl} msg={'Game is loading...'} />;
      default:
        return <p>FAIL</p>;
    }
  };

  return serverState !== STATES.END ? (
    // This can be improved ... but I currently don't care
    <>
      <TabBar serverState={serverState} handleChange={handleTabChange} />
      {activeTabId === 0 ? (
        <TabPanel active={activeTabId} index={0}>
          {getViewByState()}
        </TabPanel>
      ) : null}
      {activeTabId === 1 ? (
        <TabPanel active={activeTabId} index={1}>
          <ScoreBoard playerData={playersData} />
        </TabPanel>
      ) : null}
      {activeTabId === 2 ? (
        <TabPanel active={activeTabId} index={2}>
          <ActionsView playerData={playersData} onTradeIn={tradeInWin} onLeaveGame={leaveGame} />
        </TabPanel>
      ) : null}
    </>
  ) : (
    getViewByState()
  );
};

export default Home;
