import { useEffect, useRef, useState } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { RoundData } from '../interfaces/api';

const GAME_RECIVE_LISTENER = 'sendGame';
const NEW_ROUND_LISTENER = 'newRound';
const GET_PLAYER_LISTENER = 'playerData';
const MEME_RECEIVE_LISTENER = 'sendMeme';

const LEAVE_GAME_EVENT = 'leaveGame';
const START_GAME_EVENT = 'startGame';
const CONFIRM_MEMESELECT_EVENT = 'confirmMeme';
const CONFIRM_SELECTION_EVENT = 'confirmSelection';

const SOCKET_SERVER_URL = 'http://localhost:3030';
export interface SocketConnection {
  roundData: RoundData;
  playersData: any;
  serverState: number;
  startGame: () => void;
  leaveGame: () => void;
  confirmMeme: (cardId) => void;
}

const useConnection = (roomId: string): SocketConnection => {
  const [roundData, setRoundData] = useState({});
  const [playersData, setPlayersData] = useState([]);
  const [serverState, setServerState] = useState(0);

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
        Cookies.set('roomId', data._id);
      }
      setServerState(data._STATE);
      setPlayersData(data._players);
    });

    socketRef.current.on(NEW_ROUND_LISTENER, (data) => {
      setRoundData({ ...data });
      setServerState(data.serverState);
    });

    socketRef.current.on(GET_PLAYER_LISTENER, (data) => {
      setPlayersData([...data]);
    });

    socketRef.current.on(MEME_RECEIVE_LISTENER, (data) => {
      const rd = { ...roundData, ...data };
      setRoundData(rd);
      setServerState(data.serverState);
    });
  }, []);

  const leaveGame = () => {
    socketRef.current.emit(
      LEAVE_GAME_EVENT,
      {
        senderId: Cookies.get('userName'),
        roomId: Cookies.get('roomId'),
      },
      () => {
        Cookies.remove('roomId');
        history.push(`/`);
      }
    );
  };

  const startGame = () => {
    socketRef.current.emit(START_GAME_EVENT, {
      roomId: Cookies.get('roomId'),
    });
  };

  const confirmMeme = (cardId) => {
    socketRef.current.emit(CONFIRM_MEMESELECT_EVENT, {
      roomId: Cookies.get('roomId'),
      cardId,
    });
  };

  return {
    roundData,
    playersData,
    serverState,
    startGame,
    leaveGame,
    confirmMeme,
  };
};

export default useConnection;
