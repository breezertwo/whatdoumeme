import { generateUniqueId } from './utils';

interface Player {
  username: string;
  score: number;
  hasCommitted: boolean;
}

export enum STATES {
  WAITING = 0,
  STARTED = 1,
  COMITTED = 2,
  ANSWERS = 3,
}

export class Game {
  private readonly _id: string;
  private players: Player[] = [];
  private _STATE: STATES;

  constructor() {
    this._STATE = STATES.WAITING;
    this._id = generateUniqueId();
  }

  get state(): number {
    return this._STATE;
  }

  get id(): string {
    return this._id;
  }

  private getPlayerByName(playerName: string): Player[] {
    return this.players.filter((player) => player.username === playerName);
  }

  public joinGame(playerName: string): Game {
    if (this.getPlayerByName(playerName).length === 0)
      this.players.push({
        username: playerName,
        score: 0,
        hasCommitted: false,
      });
    return this;
  }

  public leaveGame(playerName: string): Player[] {
    this.players = this.players.filter(
      (player) => player.username !== playerName
    );
    return this.players;
  }
}
