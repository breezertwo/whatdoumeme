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
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export interface CzarViewProps {
  roundData: any;
  onCardClicked: (cardId: string) => void;
  onConfirmClicked: () => void;
}

const CzarView = ({ roundData, onConfirmClicked, onCardClicked }: CzarViewProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.mainContainer}>
      {roundData.isCzar ? (
        <>
          <h1>You are the meme czar. Select a meme...</h1>
          <Cards
            onCardClicked={onCardClicked}
            playerCards={roundData.memeCards}
            isCzar={roundData.isCzar}
          />
          <div onClick={onConfirmClicked} className="confirmBtn">
            Confirm Selection
          </div>{' '}
        </>
      ) : (
        <div className={classes.spinnerContainer}>
          <h1>Wait until czar selects a meme...</h1>
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default CzarView;
