import { Player } from '../../interfaces/api';
import CrownSolid from '../../assets/svg/crown-solid.svg?react';

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export interface PlayerListProps {
  players: Player[];
  includeGameData?: boolean;
  includeCzar?: boolean;
  includeHost?: boolean;
}

export const PlayerList = ({ players, includeGameData = false, includeCzar = false, includeHost = false }: PlayerListProps) => {
  const getItemClass = (player: Player): string => {
    if (player.host && includeHost) return 'player-item player-item--host';
    if (player.isCzar && includeCzar) return 'player-item player-item--czar';
    return 'player-item';
  };

  return (
    <ul className="player-list">
      {players
        .sort((a, b) => b.score - a.score)
        .map((player, i) => (
          <li key={i} className={getItemClass(player)}>
            <div className="player-item__content">
              <div className="player-item__name">
                {player.isCzar && includeCzar && <CrownSolid />}
                {player.host && includeHost && <PersonIcon />}
                {player.username}
              </div>
              {includeGameData && <p>Score: {player.score}</p>}
            </div>
          </li>
        ))}
    </ul>
  );
};
