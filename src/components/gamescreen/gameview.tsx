import React from 'react';
import { makeStyles } from '@material-ui/core';

import Cards from '../cards/Cards';
import MemeView from './memeView';
import { RoundData } from '../../interfaces/api';

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
  onConfirmClicked?: (cardId: string) => void;
}

const GameView = ({
  roundData,
  onConfirmClicked,
  onCardClicked,
}: GameViewProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.mainContainer}>
      <MemeView currentMeme={roundData.currentMeme} />
      <Cards
        onCardClicked={onCardClicked}
        playerCards={roundData.playerCards}
        isCzar={false}
      />
      <div onClick={() => onConfirmClicked} className="confirmBtn">
        Confirm Selection
      </div>
    </div>
  );
};

export default GameView;
