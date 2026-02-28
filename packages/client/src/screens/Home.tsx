import { useParams } from 'react-router-dom';

import { SocketProvider } from '../socket/SocketProvider';
import { GameScreen } from '../components/gamescreen/mainView';

export const Home = () => {
  const { roomId } = useParams();

  console.log('Home component mounted', roomId);

  return (
    <SocketProvider roomId={roomId}>
      <GameScreen />
    </SocketProvider>
  );
};
