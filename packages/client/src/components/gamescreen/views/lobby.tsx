import React, { ChangeEvent, useState } from 'react';
import { Button } from '@base-ui/react/button';
import Cookies from 'js-cookie';
import { PlayerList } from '../../common';
import { useIsHost } from '../../../hooks/useIsHost';
import { Player } from '../../../interfaces/api';

export interface LobbyProps {
  players: Player[];
  onLeaveClick: () => void;
  onStartClick: (maxWinPoints?: number) => void;
}

export const Lobby = ({ players, onStartClick, onLeaveClick }: LobbyProps) => {
  const [maxPoints, setMaxPoints] = useState(4);
  const isHost = useIsHost(players);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMaxPoints(parseInt(event.target.value));
  };

  return (
    <div className="lobby">
      <div className="lobby-header">
        <div className="lobby-spacing">
          <h2>Lobby: {Cookies.get('roomId')}</h2>
        </div>
        <div className="lobby-actions">
          {isHost && (
            <Button className="btn btn-primary" onClick={() => onStartClick(maxPoints)}>
              Start
            </Button>
          )}
          <Button className="btn btn-secondary" onClick={onLeaveClick}>
            Leave
          </Button>
        </div>
      </div>
      {isHost && (
        <div className="lobby-header lobby-spacing">
          <p>Points to win:</p>
          <input type="number" className="number-input" defaultValue={4} min={1} onChange={handleInputChange} aria-label="Points to win" />
        </div>
      )}
      <PlayerList players={players} includeHost={true} />
    </div>
  );
};
