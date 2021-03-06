// Serverstates
export enum STATES {
  LOADING = -1,
  WAITING = 0,
  STARTED = 1,
  COMITTED = 2,
  ANSWERS = 3,
  MEMELORD = 4,
  WINNER = 5,
  END = 6,
}

// TODO: Type API

export interface RoundData {
  isCzar?: boolean;
  playerCards?: any[];
  memeCards?: any[];
  currentMeme?: string;
  currentCzar?: string;
  serverState?: number;
  randomMeme?: string;
  winner?: string;
}

export interface Player {
  username: string;
  host: boolean;
  score: number;
  tradeOptions: number;
  isCzar: boolean;
}
