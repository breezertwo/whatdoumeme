import { Button } from '@base-ui/react/button';
import { useIsHost } from '../../../hooks/useIsHost';
import { PlayerList } from '../../common';
import { Player } from '../../../interfaces/api';

export interface EndScreenProps {
  playerData: Player[];
  onRestart: () => void;
  onLeave: () => void;
}

export const EndScreenView = ({ playerData, onRestart, onLeave }: EndScreenProps) => {
  const isHost = useIsHost(playerData);

  return (
    <>
      <h1>Game ended!</h1>
      <PlayerList players={playerData} includeGameData={true} />
      <div className="btn-row">
        {isHost && (
          <Button className="btn btn-primary" onClick={onRestart}>
            Start new round
          </Button>
        )}
        <Button className="btn btn-secondary" onClick={onLeave}>
          Leave
        </Button>
      </div>
    </>
  );
};
