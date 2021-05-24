import React from 'react';
import { makeStyles } from '@material-ui/core';

import Cards from '../cards/Cards';
import MemeView from './memeView';

const useStyles = makeStyles({
  mainContainer: {
    justifyContent: 'space-around',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
});

export interface GameViewProps {
  roundData: any;
  onCardClicked: (cardId: number) => void;
}

const GameView = ({ roundData, onCardClicked }: GameViewProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.mainContainer}>
      <MemeView isCzar={roundData.isCzar} />
      <Cards
        onCardClicked={onCardClicked}
        playerCards={roundData.playerCards}
        isCzar={roundData.isCzar}
      />
      <div className="confirmBtn">Confirm Selection</div>
    </div>
  );
};

export default GameView;
