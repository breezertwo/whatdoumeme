import React from 'react';
import { makeStyles } from '@material-ui/core';

import Cards from '../cards/Cards';
import { RoundData, STATES } from '../../../interfaces/api';
import LoadingSpinner from '../../common/loadingSpinner';
import { ButtonContainer, MemeView } from './subviews';

const useStyles = makeStyles({
  mainContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-around',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '600px',
  },
});

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
  const classes = useStyles();

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
        active={!czarIsSelecting || (czarIsSelecting && roundData.isCzar)}
        onConfirmClicked={onConfirmClicked}
        onLeaveClick={onLeaveClick}
      />
    </div>
  ) : (
    <LoadingSpinner msg={'Wait until players select cards...'} />
  );
};
