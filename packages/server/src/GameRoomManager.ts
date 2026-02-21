import Game from './Game';

/**
 * Owns the active game room registry.
 * Separating this from the HTTP/socket layer keeps MemeServer lean and makes
 * room lifecycle testable without standing up a server.
 */
export class GameRoomManager {
  private readonly rooms = new Map<string, Game>();

  createRoom(hostUsername: string): Game {
    const game = new Game(hostUsername);
    this.rooms.set(game.id, game);
    return game;
  }

  findRoom(roomId: string): Game | undefined {
    return this.rooms.get(roomId.toUpperCase());
  }

  deleteRoom(roomId: string): void {
    this.rooms.delete(roomId);
  }
}
