import Game from './Game';
import { AppDatabase } from './db';

/**
 * Owns the active game room registry.
 * On construction it hydrates rooms from the database so that active games
 * survive a server restart. Players reconnect naturally — joinGame() updates
 * their stale socketId when they re-establish their socket connection.
 */
export class GameRoomManager {
  private readonly rooms = new Map<string, Game>();

  constructor(private readonly db: AppDatabase) {
    for (const snap of db.loadAllRooms()) {
      const game = Game.fromSnapshot(snap);
      this.rooms.set(game.id, game);
    }
    console.log(`[RM] Hydrated ${this.rooms.size} room(s) from database`);
  }

  createRoom(hostUsername: string): Game {
    const game = new Game(hostUsername);
    this.rooms.set(game.id, game);
    this.db.saveRoom(game.toSnapshot());
    return game;
  }

  findRoom(roomId: string): Game | undefined {
    return this.rooms.get(roomId.toUpperCase());
  }

  /** Persist the current in-memory state of a room. Call after every mutation. */
  saveRoom(game: Game): void {
    this.db.saveRoom(game.toSnapshot());
  }

  deleteRoom(roomId: string): void {
    this.rooms.delete(roomId);
    this.db.deleteRoom(roomId);
  }
}
