import React from 'react';
import { Player } from '../../interfaces/api';
import { PlayerList } from '../common';
import { useMainContianerStyles } from '../gamescreen/views/styles/sharedStyles';

export interface ScoreBoardProps {
  playerData: Player[];
}

export const ScoreBoard = ({ playerData }: ScoreBoardProps): JSX.Element => {
  const classes = useMainContianerStyles();

  return (
    <div className={classes.mainContainer}>
      <PlayerList players={playerData} includeGameData={true} includeCzar={true} />
    </div>
  );
};
