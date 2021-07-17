import { useState, useEffect } from 'react';
import { Player } from '../interfaces/api';
import Cookies from 'js-cookie';

export function useGetPlayerFromPlayerData(players: Player[]): Player {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (players.length > 0) {
      const player = players.filter((player) => player.username === Cookies.get('userName'))[0];
      if (player) {
        setPlayer(player);
      }
    }
  }, [players]);

  return player;
}
