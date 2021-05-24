import { useEffect, useRef, useState } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { getPlayers, getRoundData } from '../mockApi';

const NEW_ROUND_EVENT = 'newRound';
const GET_PLAYER_EVENT = 'playerData';
const CONFIRM_SELECTION_EVENT = 'confirmSelection';
const SOCKET_SERVER_URL = 'http://localhost:3030';

export interface SocketConnection {
  roundData: any;
  playersData: any;
  sendSelectedCard: (confirmMsg: unknown) => void;
}

const useConnection = (roomId: string): SocketConnection => {
  const [roundData, setRoundData] = useState(getRoundData());
  const [playersData, setPlayersData] = useState(getPlayers());

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

  return { roundData, playersData, sendSelectedCard };
};

export default useConnection;
