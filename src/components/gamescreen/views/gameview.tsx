import React, { useState } from 'react';

import Cards from '../cards/Cards';
import { RoundData, STATES } from '../../../interfaces/api';
import LoadingSpinner from '../../common/loadingSpinner';
import { ButtonContainer, MemeView } from './subviews';
import { useMainContianerStyles } from './styles/sharedStyles';

export interface GameViewProps {
  roundData: RoundData;
  onCardClicked: (cardId: string) => void;
  onConfirmClicked: () => void;
  onLeaveClick: () => void;
}

export const GameView = ({
  roundData,
  onConfirmClicked,
  onCardClicked,
  onLeaveClick,
}: GameViewProps): JSX.Element => {
  const [confirmed, setConfirmed] = useState(false);
  const { currentMeme, playerCards, serverState } = roundData;
  const classes = useMainContianerStyles();

  const czarIsSelecting = serverState === STATES.ANSWERS;

  const onConfirmClickedLocal = () => {
    setConfirmed(true);
    onConfirmClicked();
  };

  return (!roundData.isCzar || (roundData.isCzar && czarIsSelecting)) && !confirmed ? (
    <div className={classes.mainContainer}>
      <MemeView currentMeme={currentMeme} />
      <Cards
        onCardClicked={onCardClicked}
        playerCards={playerCards}
        isShowComitted={czarIsSelecting}
      />
      <ButtonContainer
        onConfirmClicked={
          !czarIsSelecting || (czarIsSelecting && roundData.isCzar) ? onConfirmClickedLocal : null
        }
        onLeaveClick={onLeaveClick}
      />
    </div>
  ) : (
    <LoadingSpinner
      msg={!confirmed ? 'Wait until players select cards...' : 'Committing answer...'}
    />
  );
};
