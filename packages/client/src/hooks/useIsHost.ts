import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

export function useIsHost(players: any[]): boolean {
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (players.length > 0) {
      const player = players.filter((player) => player.username === Cookies.get('userName'))[0];
      if (player) {
        setIsHost(player.host);
      }
    }
  }, [players]);

  return isHost;
}
