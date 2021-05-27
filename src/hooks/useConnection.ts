import { useEffect, useRef, useState } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

const NEW_ROUND_EVENT = 'newRound';
const LEAVE_GAME_EVENT = 'leaveGame';
const START_GAME_EVENT = 'startGame';
const GAME_RECIVE_EVENT = 'sendGame';
const GET_PLAYER_EVENT = 'playerData';

const CONFIRM_SELECTION_EVENT = 'confirmSelection';
const CONFIRM_MEMESELECT_EVENT = 'confirmMeme';

const SOCKET_SERVER_URL = 'http://localhost:3030';

export interface SocketConnection {
  roundData: any;
  playersData: any;
  serverState: number;
  startGame: () => void;
  leaveGame: () => void;
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
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on(GAME_RECIVE_EVENT, (data) => {
      if (!Cookies.get('roomId')) {
        Cookies.set('roomId', data._id);
      }
      setServerState(data._STATE);
      setPlayersData(data._players);
    });

    socketRef.current.on(NEW_ROUND_EVENT, (data) => {
      console.log('NR' + data);
      setRoundData({ ...data });
      setServerState(data.serverState);
    });

    socketRef.current.on(GET_PLAYER_EVENT, (data) => {
      console.log('PE' + data);
      setPlayersData([...data]);
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

  return { roundData, playersData, serverState, startGame, leaveGame };
};

export default useConnection;
