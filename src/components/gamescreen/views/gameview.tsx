import React from 'react';
import { makeStyles } from '@material-ui/core';

import Cards from '../cards/Cards';
import { RoundData, STATES } from '../../../interfaces/api';
import { MemeView } from './subviews/memeSubView';
import LoadingSpinner from '../../common/loadingSpinner';

const useStyles = makeStyles({
  mainContainer: {
    justifyContent: 'space-around',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
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

  return !roundData.isCzar ? (
    <div className={classes.mainContainer}>
      <MemeView currentMeme={currentMeme} />
      <Cards
        onCardClicked={onCardClicked}
        playerCards={playerCards}
        isShowComitted={serverState === STATES.SELECTING}
      />
      <div onClick={onConfirmClicked} className="confirmBtn">
        Confirm Selection
      </div>
      <div onClick={onLeaveClick} className="cnclBtn algnCtr">
        Leave Game
      </div>
    </div>
  ) : (
    <LoadingSpinner msg={'Wait until players select cards...'} />
  );
};
