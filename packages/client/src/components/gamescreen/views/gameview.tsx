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
  requestMemeUrl: () => Promise<string>;
}

export const GameView = ({
  roundData,
  onConfirmClicked,
  onCardClicked,
  requestMemeUrl,
}: GameViewProps): JSX.Element => {
  const { currentMeme, playerCards, serverState } = roundData;
  const classes = useMainContianerStyles();

  const czarIsSelecting = serverState === STATES.ANSWERS;

  return !roundData.isCzar || (roundData.isCzar && czarIsSelecting) ? (
    <div className={classes.mainContainer} style={{ justifyContent: 'space-around' }}>
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
      />
    </div>
  ) : (
    <LoadingSpinner requestMemeUrl={requestMemeUrl} msg={'Wait until players select cards...'} />
  );
};
