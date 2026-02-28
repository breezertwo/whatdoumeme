import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { STATES } from '../interfaces/api';
import { ServerEvent, SendGamePayload, RoundPayload, Player } from './events';
import { useSocket } from './SocketProvider';

export interface GameState {
  serverState: number;
  roundData: RoundPayload | null;
  players: Player[];
  /** Call this after the player submits their card to show the committed view
   *  while waiting for others. The next newRound event will override it. */
  markCommitted: () => void;
}

/**
 * Subscribes to all server → client game events
 */
export function useGameState(): GameState {
  const { service } = useSocket();

  const [serverState, setServerState] = useState<number>(Cookies.get('roomId') ? STATES.LOADING : STATES.WAITING);
  const [roundData, setRoundData] = useState<RoundPayload | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const unsubs = [
      service.on<SendGamePayload>(ServerEvent.SEND_GAME, (data) => {
        Cookies.set('roomId', data.id);
        setPlayers(data.playerData);
        setServerState(data.state);
      }),

      service.on<RoundPayload>(ServerEvent.NEW_ROUND, (data) => {
        setRoundData(data);
        setServerState(data.serverState);
      }),

      service.on<Player[]>(ServerEvent.PLAYER_DATA, (data) => {
        setPlayers(data);
      }),

      service.on<void>(ServerEvent.ROUND_END, () => {
        setServerState(STATES.END);
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [service]);

  const markCommitted = () => setServerState(STATES.COMITTED);

  return { serverState, roundData, players, markCommitted };
}
