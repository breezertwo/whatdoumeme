export interface MemeCard extends Card {
  name: string;
}

export interface WhiteCard extends Card {
  text: string;
}

interface Card {
  cardId: string;
}

export interface Deck {
  memeCards: MemeCard[];
  whiteCards: WhiteCard[];
}

export interface RoundData {
  serverState: number;
  isCzar: boolean;
  playerCards: WhiteCard[];
  memeCards: MemeCard[] | undefined;
  currentMeme: string | undefined;
  currentCzar: string;
}

export interface BasePlayer {
  username: string;
  host: boolean;
  score: number;
  tradeOptions: number;
  isCzar: boolean;
}

export interface Player extends BasePlayer {
  socketId: string;
  hasCommitted: boolean;
  cards: WhiteCard[];
  winCards: MemeCard[];
}

/**
 * Plain JSON-serializable snapshot of a Game instance.
 * Used to persist rooms to SQLite and restore them on server restart.
 * Fields that are uninitialized before Game.initGame() are nullable.
 */
export interface GameSnapshot {
  id: string;
  host: string;
  maxScore: number | null;
  state: number;
  currentCzar: string | null;
  selectedMeme: MemeCard | null;
  players: Player[];
  deckMeme: MemeCard[] | null;
  deckCards: WhiteCard[] | null;
  currentPlayedCards: (WhiteCard & { owner: string })[] | null;
}
