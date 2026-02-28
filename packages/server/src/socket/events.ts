// Event name registries — string values must stay in sync with
// packages/client/src/socket/events.ts.

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
