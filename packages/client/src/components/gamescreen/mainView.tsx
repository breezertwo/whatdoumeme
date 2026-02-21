import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs } from '@base-ui/react/tabs';
import useConnection from '../../hooks/useConnection';
import LoadingSpinner from '../common/loadingSpinner';
import { CzarView, GameView, Lobby, WinnerView, EndScreenView } from './views';
import { TabBar } from './views/subviews';
import { STATES } from '../../interfaces/api';
import { ScoreBoard } from '../scoreboard/scoreBoard';
import { ActionsView } from '../actionmenue/actionmenue';

const Home = () => {
  const [selectedCardId, setSelectedCard] = useState<string>(null);
  const { roomId } = useParams();

  const { roundData, playersData, serverState, startGame, leaveGame, confirmCard, confirmMeme, tradeInWin, requestMemeUrl } =
    useConnection(roomId);

  const onCardClicked = (id: string): void => {
    setSelectedCard(id);
  };

  const handleConfirmCard = (): void => {
    confirmCard(selectedCardId);
    setSelectedCard(null);
  };

  const handleConfirmMeme = (): void => {
    confirmMeme(selectedCardId);
    setSelectedCard(null);
  };

  const getViewByState = () => {
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
        return <LoadingSpinner requestMemeUrl={requestMemeUrl} msg={'Committed. Waiting for the others...'} />;
      case STATES.END:
        return <EndScreenView playerData={playersData} onRestart={startGame} onLeave={leaveGame} />;
      case STATES.LOADING:
        return <LoadingSpinner requestMemeUrl={requestMemeUrl} msg={'Game is loading...'} />;
      default:
        return <p>FAIL</p>;
    }
  };

  return serverState !== STATES.END ? (
    <Tabs.Root defaultValue={0}>
      <TabBar serverState={serverState} />
      <Tabs.Panel value={0} className="tab-panel">
        {getViewByState()}
      </Tabs.Panel>
      <Tabs.Panel value={1} className="tab-panel">
        <ScoreBoard playerData={playersData} />
      </Tabs.Panel>
      <Tabs.Panel value={2} className="tab-panel">
        <ActionsView playerData={playersData} onTradeIn={tradeInWin} onLeaveGame={leaveGame} />
      </Tabs.Panel>
    </Tabs.Root>
  ) : (
    getViewByState()
  );
};

export default Home;
