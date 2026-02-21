import { Button } from '@base-ui/react/button';
import { Player } from '../../interfaces/api';
import { useGetPlayerFromPlayerData } from '../../hooks/useGetPlayerFromPlayerData';

export interface ActionsViewProps {
  playerData: Player[];
  onTradeIn: () => void;
  onLeaveGame: () => void;
}

export const ActionsView = ({ playerData, onTradeIn, onLeaveGame }: ActionsViewProps) => {
  const player = useGetPlayerFromPlayerData(playerData);

  return (
    <div className="main-container">
      {player && !player.isCzar ? (
        <>
          <h2>Use a winpoint to reset your handcards</h2>
          <p>Winpoints left: {player.tradeOptions}</p>
          {player.tradeOptions > 0 && (
            <Button className="btn btn-primary" style={{ marginTop: 5 }} onClick={onTradeIn}>
              Use Winpoint
            </Button>
          )}
        </>
      ) : (
        <p>No available action</p>
      )}
      <Button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={onLeaveGame}>
        Leave game
      </Button>
    </div>
  );
};
