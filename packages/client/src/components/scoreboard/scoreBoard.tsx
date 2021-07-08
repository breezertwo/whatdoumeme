import React from 'react';
import { PlayerList } from '../common';

export interface ScoreBoardProps {
  playerData: any;
}

export const ScoreBoard = ({ playerData }: ScoreBoardProps): JSX.Element => {
  return <PlayerList players={playerData} includeGameData={true} />;
};
