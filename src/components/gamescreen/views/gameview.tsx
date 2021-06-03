import React from 'react';
import { makeStyles } from '@material-ui/core';

import Cards from '../cards/Cards';
import { RoundData, STATES } from '../../../interfaces/api';
import { MemeView } from './subviews/memeSubView';
import LoadingSpinner from '../../common/loadingSpinner';

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

  const czarIsSelecting = serverState === STATES.SELECTING;

  const loadingMessage = (isSelecting: boolean): string => {
    if (isSelecting) return 'Wait until czar selects his winning cards..';
    return 'Wait until players select cards...';
  };

  return (!roundData.isCzar && !czarIsSelecting) || (roundData.isCzar && czarIsSelecting) ? (
    <div className={classes.mainContainer}>
      <MemeView currentMeme={currentMeme} />
      <Cards
        onCardClicked={onCardClicked}
        playerCards={playerCards}
        isShowComitted={czarIsSelecting}
      />
      <div onClick={onConfirmClicked} className="confirmBtn">
        Confirm Selection
      </div>
      <div onClick={onLeaveClick} className="cnclBtn algnCtr">
        Leave Game
      </div>
    </div>
  ) : (
    <LoadingSpinner msg={loadingMessage(czarIsSelecting)} />
  );
};
