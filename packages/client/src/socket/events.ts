// ── Event name registries ────────────────────────────────────────────────────
// Add new events here. The string values must match the server constants in
// MemeServer.ts exactly.

export const ServerEvent = {
  SEND_GAME: 'sendGame',
  NEW_ROUND: 'newRound',
  PLAYER_DATA: 'playerData',
  ROUND_END: 'roundEnd',
} as const;

export const ClientEvent = {
  START_GAME: 'startGame',
  LEAVE_GAME: 'leaveGame',
  CONFIRM_MEME: 'confirmMeme',
  CONFIRM_CARD: 'confirmSelection',
  CONFIRM_WINNER: 'confirmSelectionWinner',
  TRADE_IN_CARD: 'tradeInCard',
  REQUEST_MEME: 'requestMeme',
} as const;

// ── Shared data types ────────────────────────────────────────────────────────

export interface WhiteCard {
  cardId: string;
  text: string;
}

export interface MemeCard {
  cardId: string;
  name: string;
}

export interface Player {
  username: string;
  host: boolean;
  score: number;
  tradeOptions: number;
  isCzar: boolean;
}

// ── Server → Client payload types ────────────────────────────────────────────

export interface SendGamePayload {
  id: string;
  state: number;
  playerData: Player[];
}

/** Emitted on every state transition; winner is present on WINNER state only. */
export interface RoundPayload {
  serverState: number;
  isCzar: boolean;
  /** Player's hand cards in normal play; all committed cards in ANSWERS/WINNER state. */
  playerCards: (WhiteCard & { owner?: string })[];
  /** Present for the czar during MEMELORD state only. */
  memeCards?: MemeCard[];
  currentMeme?: string;
  currentCzar: string;
  winner?: string;
}

// ── Client → Server payload types ────────────────────────────────────────────
// NOTE: senderId and roomId are intentionally absent from all payloads.
// The server resolves player identity from socket.data, which is set at
// connection time. When auth is added, socket.data will come from the
// verified token — no changes needed here.

export interface StartGamePayload {
  maxWinPoints?: number;
}

export interface ConfirmMemePayload {
  cardId: string;
}

export interface ConfirmCardPayload {
  cardId: string;
}
