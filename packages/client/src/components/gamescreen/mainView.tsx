import { useState } from 'react';
import { Tabs } from '@base-ui/react/tabs';

import { useGameState } from '../../socket/useGameState';
import { useGameActions } from '../../socket/useGameActions';
import { STATES } from '../../interfaces/api';

import LoadingSpinner from '../common/loadingSpinner';
import { CzarView, GameView, Lobby, WinnerView, EndScreenView } from './views';
import { TabBar } from './views/subviews';
import { ScoreBoard } from '../scoreboard/scoreBoard';
import { ActionsView } from '../actionmenue/actionmenue';

// ── GameScreen ───────────────────────────────────────────────────────────────
// Consumes the socket context provided by the parent Home component.

export const GameScreen = () => {
  const [selectedCardId, setSelectedCard] = useState<string>(null);

  const { serverState, roundData, players, markCommitted } = useGameState();
  const actions = useGameActions();

  const onCardClicked = (id: string): void => setSelectedCard(id);

  const handleConfirmCard = (): void => {
    if (!selectedCardId) return;
    if (serverState === STATES.ANSWERS) {
      // Czar selects the winning card
      actions.submitWinnerCard(selectedCardId);
    } else {
      // Player submits their card — fire and forget, markCommitted immediately
      // so the UI switches to the waiting spinner. The next newRound event from
      // the server will override this state with the real ANSWERS/MEMELORD value.
      markCommitted();
      actions.submitCard(selectedCardId);
    }
    setSelectedCard(null);
  };

  const handleConfirmMeme = (): void => {
    if (selectedCardId) {
      actions.confirmMeme(selectedCardId);
      setSelectedCard(null);
    }
  };

  const getViewByState = () => {
    switch (serverState) {
      case STATES.WAITING:
        return <Lobby players={players} onStartClick={actions.startGame} onLeaveClick={actions.leaveGame} />;

      case STATES.STARTED:
      case STATES.ANSWERS:
        return (
          <GameView
            roundData={roundData}
            onConfirmClicked={handleConfirmCard}
            onCardClicked={onCardClicked}
            onLeaveClick={actions.leaveGame}
            requestMemeUrl={actions.requestMeme}
          />
        );

      case STATES.MEMELORD:
        return (
          <CzarView
            roundData={roundData}
            onConfirmClicked={handleConfirmMeme}
            onCardClicked={onCardClicked}
            onLeaveClick={actions.leaveGame}
            requestMemeUrl={actions.requestMeme}
          />
        );

      case STATES.WINNER:
        return <WinnerView roundData={roundData} />;

      case STATES.COMITTED:
        return <LoadingSpinner requestMemeUrl={actions.requestMeme} msg="Committed. Waiting for the others..." />;

      case STATES.END:
        return <EndScreenView playerData={players} onRestart={actions.startGame} onLeave={actions.leaveGame} />;

      case STATES.LOADING:
        return <LoadingSpinner requestMemeUrl={actions.requestMeme} msg="Game is loading..." />;

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
        <ScoreBoard playerData={players} />
      </Tabs.Panel>
      <Tabs.Panel value={2} className="tab-panel">
        <ActionsView playerData={players} onTradeIn={actions.tradeInCard} onLeaveGame={actions.leaveGame} />
      </Tabs.Panel>
    </Tabs.Root>
  ) : (
    getViewByState()
  );
};
