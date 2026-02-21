// Server game states — LOADING and END are client-only values not present
// in the server's STATES enum (END is triggered by the roundEnd event,
// LOADING is the initial state while awaiting the first sendGame event).
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

export type {
  /**
   * @deprecated Use export from '../socket/events';
   */
  Player,
  /**
   * @deprecated Use export from '../socket/events';
   */
  RoundPayload as RoundData,
  /**
   * @deprecated Use export from '../socket/events';
   */
  WhiteCard,
  /**
   * @deprecated Use export from '../socket/events';
   */
  MemeCard,
} from '../socket/events';
