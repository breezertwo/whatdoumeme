import { Server, Socket } from 'socket.io';

import Game, { STATES } from '../Game';
import { AppDatabase } from '../db';
import { GameRoomManager } from '../GameRoomManager';
import * as Utils from '../utils';
import { ClientEvent, ServerEvent } from './events';

/**
 * Handles all client → server events for a single socket connection.
 */
export class GameSocketHandler {
  constructor(
    private readonly socket: Socket,
    private readonly io: Server,
    private readonly db: AppDatabase,
    private readonly rooms: GameRoomManager
  ) {}

  register(): void {
    this.socket.on(ClientEvent.LEAVE_GAME, this.onLeaveGame);
    this.socket.on(ClientEvent.START_GAME, this.onStartGame);
    this.socket.on(ClientEvent.TRADE_IN_CARD, this.onTradeInCard);
    this.socket.on(ClientEvent.CONFIRM_MEME, this.onConfirmMeme);
    this.socket.on(ClientEvent.CONFIRM_CARD, this.onConfirmCard);
    this.socket.on(ClientEvent.CONFIRM_WINNER, this.onConfirmWinner);
    this.socket.on(ClientEvent.REQUEST_MEME, this.onRequestMeme);
    this.socket.on('disconnect', this.onDisconnect);
  }

  // ── Context helper ──────────────────────────────────────────────────────────

  /** Resolves the caller's identity and room from socket.data. */
  private get context(): { username: string | undefined; game: Game | undefined } {
    const username = this.socket.data.username as string | undefined;
    const roomId = this.socket.data.roomId as string | undefined;
    const game = roomId ? this.rooms.findRoom(roomId) : undefined;
    return { username, game };
  }

  // ── Emit helper ─────────────────────────────────────────────────────────────

  /**
   * Sends a personalised NEW_ROUND payload to every player in the game.
   * Each player receives only their own hand (or all committed cards when in
   * ANSWERS/WINNER state) — getRound() handles that distinction.
   */
  private emitRoundToAll(game: Game, extra?: Record<string, unknown>): void {
    for (const player of game.players) {
      const data = { ...game.getRound(player.username), ...extra };
      if (player.socketId === this.socket.id) {
        this.socket.emit(ServerEvent.NEW_ROUND, data);
      } else {
        this.socket.to(player.socketId).emit(ServerEvent.NEW_ROUND, data);
      }
    }
  }

  // ── Event handlers ──────────────────────────────────────────────────────────

  private onLeaveGame = (_data: unknown, callback: (ok: boolean) => void): void => {
    const { username, game } = this.context;
    if (!username || !game) {
      callback(false);
      return;
    }

    game.leaveGame(username);
    this.socket.leave(game.id);
    callback(true);

    this.io.to(game.id).emit(ServerEvent.PLAYER_DATA, game.getFrontendPlayerData());

    if (game.players.length === 0) {
      this.rooms.deleteRoom(game.id);
    } else {
      this.rooms.saveRoom(game);
    }
  };

  private onStartGame = (data: { maxWinPoints?: number }): void => {
    const { game } = this.context;
    if (!game) return;

    game.initGame(data.maxWinPoints);
    this.rooms.saveRoom(game);
    this.io.to(game.id).emit(ServerEvent.PLAYER_DATA, game.getFrontendPlayerData());
    this.emitRoundToAll(game);
  };

  private onTradeInCard = (): void => {
    const { username, game } = this.context;
    if (!username || !game) return;

    if (game.renewPlayerCards(username)) {
      this.rooms.saveRoom(game);
      this.socket.emit(ServerEvent.PLAYER_DATA, game.getFrontendPlayerData());
      this.socket.emit(ServerEvent.NEW_ROUND, game.getRound(username));
    }
  };

  private onConfirmMeme = (data: { cardId: string }): void => {
    const { game } = this.context;
    if (!game) return;

    game.setSelectedMeme(data.cardId);
    this.rooms.saveRoom(game);
    this.emitRoundToAll(game);
  };

  private onConfirmCard = (data: { cardId: string }, callback: (memeUrl: string) => void): void => {
    const { username, game } = this.context;
    if (!username || !game) return;

    game.setSelectedPlayerCard(username, data.cardId);
    this.rooms.saveRoom(game);

    if (game.state === STATES.ANSWERS) {
      // Last card committed — server moves to ANSWERS, broadcast to all
      callback('');
      this.emitRoundToAll(game);
    } else {
      // Still waiting for others — give the committer a meme to look at
      callback(Utils.getRandomRedditMeme(this.db));
    }
  };

  private onConfirmWinner = (data: { cardId: string }): void => {
    const { game } = this.context;
    if (!game) return;

    const result = game.setWinningCard(data.cardId);
    this.emitRoundToAll(game, { winner: result.winner });

    if (result.hasRoundEnded) {
      // A round ended but the game continues — start the next round after delay
      game.startNewRound();
      setTimeout(() => this.emitRoundToAll(game), 10_000);
    } else {
      // The game itself ended (someone reached max score)
      this.io.to(game.id).emit(ServerEvent.ROUND_END);
    }

    // Save once after all synchronous mutations (setWinningCard + startNewRound).
    // The setTimeout above only emits — it doesn't change game state.
    this.rooms.saveRoom(game);
    this.io.to(game.id).emit(ServerEvent.PLAYER_DATA, game.getFrontendPlayerData());
  };

  private onRequestMeme = (_data: unknown, callback: (url: string) => void): void => {
    callback(Utils.getRandomRedditMeme(this.db));
  };

  private onDisconnect = (): void => {
    console.log(`[MS] ${this.socket.id} disconnected`);
  };
}
