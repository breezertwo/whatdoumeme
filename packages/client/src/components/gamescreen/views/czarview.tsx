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
  requestMemeUrl: () => Promise<string>;
}

export const CzarView = ({
  roundData,
  onConfirmClicked,
  onCardClicked,
  requestMemeUrl,
}: CzarViewProps): JSX.Element => {
  const classes = useMainContianerStyles();

  return roundData.isCzar ? (
    <div className={classes.mainContainer} style={{ justifyContent: 'space-around' }}>
      <>
        <h2>You are the meme czar. Select a meme...</h2>
        <Cards
          onCardClicked={onCardClicked}
          playerCards={roundData.memeCards}
          isCzar={roundData.isCzar}
        />
        <ButtonContainer onConfirmClicked={onConfirmClicked} />
      </>
    </div>
  ) : (
    <LoadingSpinner
      requestMemeUrl={requestMemeUrl}
      msg={`Wait until czar "${roundData.currentCzar}" selects a meme...`}
    />
  );
};
