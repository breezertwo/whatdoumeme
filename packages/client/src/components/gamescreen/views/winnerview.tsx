import React from 'react';
import { RoundData } from '../../../interfaces/api';
import Cards from '../cards/Cards';
import { useMainContianerStyles } from './styles/sharedStyles';
import { MemeView } from './subviews';

export interface WinnerViewProps {
  roundData: RoundData;
}

export const WinnerView = ({ roundData }: WinnerViewProps): JSX.Element => {
  const { currentMeme, playerCards } = roundData;
  const classes = useMainContianerStyles();

  return (
    <div className={classes.mainContainer}>
      <h2 style={{ alignSelf: 'center' }}>Winner of this round is: {roundData.winner}</h2>
      <MemeView currentMeme={currentMeme} />
      <Cards playerCards={playerCards} />
    </div>
  );
};
