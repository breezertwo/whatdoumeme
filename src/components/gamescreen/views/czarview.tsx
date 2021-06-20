import React from 'react';

import Cards from '../cards/Cards';
import LoadingSpinner from '../../common/loadingSpinner';
import { RoundData } from '../../../interfaces/api';
import { useMainContianerStyles } from './styles/sharedStyles';
import { ButtonContainer } from './subviews';

export interface CzarViewProps {
  roundData: RoundData;
  onCardClicked: (cardId: string) => void;
  onConfirmClicked: () => void;
  onLeaveClick: () => void;
}

export const CzarView = ({
  roundData,
  onConfirmClicked,
  onCardClicked,
  onLeaveClick,
}: CzarViewProps): JSX.Element => {
  const classes = useMainContianerStyles();

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
          <ButtonContainer onConfirmClicked={onConfirmClicked} onLeaveClick={onLeaveClick} />
        </>
      ) : (
        <LoadingSpinner msg={'Wait until czar selects a meme...'} />
      )}
    </div>
  );
};
