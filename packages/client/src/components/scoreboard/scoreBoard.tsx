import React from 'react';
import { Player } from '../../interfaces/api';
import { PlayerList } from '../common';

export interface ScoreBoardProps {
  playerData: Player[];
}

export const ScoreBoard = ({ playerData }: ScoreBoardProps): JSX.Element => {
  return <PlayerList players={playerData} includeGameData={true} />;
};
