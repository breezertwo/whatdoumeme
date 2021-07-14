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
