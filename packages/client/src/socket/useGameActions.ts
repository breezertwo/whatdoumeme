import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ClientEvent, StartGamePayload, ConfirmMemePayload, ConfirmCardPayload } from './events';
import { useSocket } from './SocketProvider';

/**
 * Returns typed action functions that emit client → server events.
 * Pure emitter; no state lives here.
 */
export function useGameActions() {
  const { service } = useSocket();
  const navigate = useNavigate();

  const startGame = (maxWinPoints?: number): void => {
    service.emit<StartGamePayload>(ClientEvent.START_GAME, { maxWinPoints });
  };

  const leaveGame = async (): Promise<void> => {
    try {
      await service.emitWithAck<Record<string, never>, boolean>(ClientEvent.LEAVE_GAME, {});
    } catch {
      console.warn('Game leave event failed');
    } finally {
      Cookies.remove('roomId');
      navigate('/');
    }
  };

  const submitCard = (cardId: string): Promise<string> =>
    service.emitWithAck<ConfirmCardPayload, string>(ClientEvent.CONFIRM_CARD, { cardId });

  const submitWinnerCard = (cardId: string): void => {
    service.emit<ConfirmCardPayload>(ClientEvent.CONFIRM_WINNER, { cardId });
  };

  const confirmMeme = (cardId: string): void => {
    service.emit<ConfirmMemePayload>(ClientEvent.CONFIRM_MEME, { cardId });
  };

  const tradeInCard = (): void => {
    service.emit(ClientEvent.TRADE_IN_CARD);
  };

  const requestMeme = (): Promise<string> => service.emitWithAck<Record<string, never>, string>(ClientEvent.REQUEST_MEME, {});

  return {
    startGame,
    leaveGame,
    submitCard,
    submitWinnerCard,
    confirmMeme,
    tradeInCard,
    requestMeme,
  };
}
