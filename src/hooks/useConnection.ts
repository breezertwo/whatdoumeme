import { useEffect, useRef, useState } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import Cookies from 'js-cookie';
import { getPlayers, getRoundData } from '../mockApi';

const NEW_ROUND_EVENT = 'newRound';
const GAME_RECIVE_EVENT = 'sendGame';

const GET_PLAYER_EVENT = 'playerData';
const CONFIRM_SELECTION_EVENT = 'confirmSelection';
const SOCKET_SERVER_URL = 'http://localhost:3030';

export interface SocketConnection {
  roundData: any;
  playersData: any;
  serverState: number;
  sendSelectedCard: (confirmMsg: unknown) => void;
}

const useConnection = (roomId: string): SocketConnection => {
  const [roundData, setRoundData] = useState(getRoundData());
  const [playersData, setPlayersData] = useState([]);
  const [serverState, setServerState] = useState(0);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>(null);

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
      setPlayersData(data.players);
    });

    socketRef.current.on(NEW_ROUND_EVENT, (data) => {
      console.log('NR' + data);
      setRoundData([...data]);
    });

    socketRef.current.on(GET_PLAYER_EVENT, (data) => {
      console.log('PE' + data);
      setPlayersData([...data]);
    });
  }, []);

  const sendSelectedCard = (confirmMsg: unknown) => {
    socketRef.current.emit(CONFIRM_SELECTION_EVENT, {
      body: confirmMsg,
      senderId: socketRef.current.id,
    });
  };

  return { roundData, playersData, serverState, sendSelectedCard };
};

export default useConnection;
