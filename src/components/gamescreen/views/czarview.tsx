import React from 'react';
import { makeStyles } from '@material-ui/core';

import Cards from '../cards/Cards';
import LoadingSpinner from '../../common/loadingSpinner';
import { RoundData } from '../../../interfaces/api';

const useStyles = makeStyles({
  mainContainer: {
    justifyContent: 'space-around',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: '600px',
  },
});

export interface CzarViewProps {
  roundData: RoundData;
  onCardClicked: (cardId: string) => void;
  onConfirmClicked: () => void;
}

export const CzarView = ({
  roundData,
  onConfirmClicked,
  onCardClicked,
}: CzarViewProps): JSX.Element => {
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
          </div>
        </>
      ) : (
        <LoadingSpinner msg={'Wait until czar selects a meme...'} />
      )}
    </div>
  );
};
