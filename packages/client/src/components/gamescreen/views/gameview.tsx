import React from 'react';
import Cards from '../cards/Cards';
import LoadingSpinner from '../../common/loadingSpinner';
import { RoundData, STATES } from '../../../interfaces/api';
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
  const { currentMeme, playerCards, serverState } = roundData;
  const classes = useMainContianerStyles();

  const czarIsSelecting = serverState === STATES.ANSWERS;

  return !roundData.isCzar || (roundData.isCzar && czarIsSelecting) ? (
    <div className={classes.mainContainer}>
      <MemeView currentMeme={currentMeme} />
      <Cards
        onCardClicked={onCardClicked}
        playerCards={playerCards}
        isShowComitted={czarIsSelecting}
      />
      <ButtonContainer
        onConfirmClicked={
          !czarIsSelecting || (czarIsSelecting && roundData.isCzar) ? onConfirmClicked : null
        }
        onLeaveClick={onLeaveClick}
      />
    </div>
  ) : (
    <LoadingSpinner msg={'Wait until players select cards...'} />
  );
};
