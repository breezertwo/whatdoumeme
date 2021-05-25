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
