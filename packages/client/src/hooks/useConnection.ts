import { useEffect, useRef, useState } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { RoundData, Player, STATES } from '../interfaces/api';
import { rejects } from 'node:assert';

const GAME_RECIVE_LISTENER = 'sendGame';
const NEW_ROUND_LISTENER = 'newRound';
const GET_PLAYER_LISTENER = 'playerData';
const GET_ROUNDEND_LISTENER = 'roundEnd';

const LEAVE_GAME_EVENT = 'leaveGame';
const START_GAME_EVENT = 'startGame';
const CONFIRM_MEMESELECT_EVENT = 'confirmMeme';
const CONFIRM_WINNER_EVENT = 'confirmSelectionWinner';
const CONFIRM_SELECTION_EVENT = 'confirmSelection';
const TRADEINCARD_EVENT = 'tradeInCard';
const REQUEST_MEME_EVENT = 'requestMeme';

const SOCKET_SERVER_URL = 'http://localhost:3030';

export interface SocketConnection {
  roundData: RoundData;
  playersData: Player[];
  serverState: number;
  startGame: (maxWinPoints?: number) => void;
  leaveGame: () => void;
  confirmMeme: (cardId: string) => void;
  confirmCard: (cardId: string) => void;
  tradeInWin: () => void;
  requestMemeUrl: () => Promise<string>;
}

const useConnection = (roomId: string): SocketConnection => {
  const [roundData, setRoundData] = useState<RoundData>({});
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [serverState, setServerState] = useState(Cookies.get('roomId') ? -1 : 0);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>(null);
  const history = useHistory();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      query: { roomId },
      withCredentials: true,
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on(GAME_RECIVE_LISTENER, (data) => {
      if (!Cookies.get('roomId')) {
        Cookies.set('roomId', data.id);
      }
      setPlayersData(data.playerData);
      setServerState(data.state);
    });

    socketRef.current.on(NEW_ROUND_LISTENER, (data) => {
      setRoundData({ ...data });
      setServerState(data.serverState);
    });

    socketRef.current.on(GET_PLAYER_LISTENER, (data) => {
      setPlayersData([...data]);
    });

    socketRef.current.on(GET_ROUNDEND_LISTENER, () => {
      setServerState(STATES.END);
    });
  }, []);

  const leaveGame = (): void => {
    if (socketRef.current.connected) {
      socketRef.current.emit(
        LEAVE_GAME_EVENT,
        {
          senderId: Cookies.get('userName'),
          roomId: Cookies.get('roomId'),
        },
        (ack: boolean) => {
          if (ack) {
            Cookies.remove('roomId');
            history.push(`/`);
          } else {
            console.error('[SERVER ERROR] Lost game');
            console.error('[GAME] Reseting...');
            Cookies.remove('roomId');
            history.push(`/`);
          }
        }
      );
    } else {
      console.error('[SERVER ERROR] No connection');
      console.error('[GAME] Reseting');
      Cookies.remove('roomId');
      history.push(`/`);
    }
  };

  const requestMemeUrl = (): Promise<string> => {
    console.log('RM');
    return new Promise<string>((resolve, reject) => {
      if (socketRef.current.connected)
        socketRef.current.emit(REQUEST_MEME_EVENT, {}, (data: string) => {
          resolve(data);
        });
      else reject();
    });
  };

  const startGame = (maxWinPoints?: number): void => {
    socketRef.current.emit(START_GAME_EVENT, {
      roomId: Cookies.get('roomId'),
      maxWinPoints: maxWinPoints,
    });
  };

  const confirmMeme = (cardId: string): void => {
    if (cardId) {
      socketRef.current.emit(CONFIRM_MEMESELECT_EVENT, {
        roomId: Cookies.get('roomId'),
        cardId,
      });
    }
  };

  const confirmCard = (cardId: string): void => {
    if (cardId) {
      const EMIT_EVENT =
        serverState === STATES.ANSWERS ? CONFIRM_WINNER_EVENT : CONFIRM_SELECTION_EVENT;

      socketRef.current.emit(
        EMIT_EVENT,
        {
          senderId: Cookies.get('userName'),
          roomId: Cookies.get('roomId'),
          cardId,
        },
        (data: string) => {
          setRoundData({ ...roundData, randomMeme: data });
          setServerState(STATES.COMITTED);
        }
      );
    }
  };

  const tradeInWin = (): void => {
    socketRef.current.emit(TRADEINCARD_EVENT, {
      senderId: Cookies.get('userName'),
      roomId: Cookies.get('roomId'),
    });
  };

  return {
    roundData,
    playersData,
    serverState,
    startGame,
    leaveGame,
    confirmCard,
    confirmMeme,
    tradeInWin,
    requestMemeUrl,
  };
};

export default useConnection;
