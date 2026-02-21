import { Player } from '../../interfaces/api';
import { PlayerList } from '../common';

export interface ScoreBoardProps {
  playerData: Player[];
}

export const ScoreBoard = ({ playerData }: ScoreBoardProps) => {
  return (
    <div className="main-container">
      <PlayerList players={playerData} includeGameData={true} includeCzar={true} />
    </div>
  );
};
