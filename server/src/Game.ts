import { deck } from './db/gameData';
import { MemeCard, WhiteCard } from './interfaces/game';
import { generateUniqueId, popRandom } from './utils';

interface Player {
  username: string;
  socketId: string;
  score: number;
  hasCommitted: boolean;
  host: boolean;
  isCzar: boolean;
  cards: WhiteCard[];
  winCards: MemeCard[];
}

export enum STATES {
  WAITING = 0,
  STARTED = 1,
  COMITTED = 2,
  ANSWERS = 3,
  MEMELORD = 4,
}

export class Game {
  private readonly _id: string;
  private readonly _host: string;
  private _players: Player[] = [];
  private _STATE: STATES;

  private deckMeme: MemeCard[];
  private deckCards: WhiteCard[];

  private selectedMeme: MemeCard;

  constructor(host: string) {
    this._STATE = STATES.WAITING;
    this._id = generateUniqueId();
    this._host = host;

    this.loadDeck();
  }

  get state(): number {
    return this._STATE;
  }

  get id(): string {
    return this._id;
  }

  get players(): Player[] {
    return this._players;
  }

  public initGame(): void {
    this.shuffleToPlayer(7);

    // make random player czar
    this.players[Math.floor(Math.random() * this.players.length)].isCzar = true;
    this._STATE = STATES.MEMELORD;
  }

  public getPlayerByName(playerName: string): Player[] {
    return this._players.filter((player) => player.username === playerName);
  }

  private shuffleToPlayer(amount: number): void {
    //TODO: Enough cards for players check
    //if (this.players.length * amount < this.deck.whiteCards.length) {
    for (let i = 0; i < amount; i++) {
      for (const player of this._players) {
        player.cards.push(popRandom(this.deckCards));
      }
    }
    //}
  }

  private loadDeck(): void {
    const _deck = deck;

    _deck.memeCards.forEach((card, index) => {
      card.cardId = `M${index}`;
    });

    _deck.whiteCards.forEach((card, index) => {
      card.cardId = `C${index}`;
    });

    this.deckMeme = _deck.memeCards;
    this.deckCards = _deck.whiteCards;
  }

  private getWhiteCard(): WhiteCard {
    //if (this.players.length * amount < this.deck.whiteCards.length)
    return this.deckCards.splice(
      (this.deckCards.length * Math.random()) | 0,
      1
    )[0];
  }

  public joinGame(playerName: string, socketId: string): Game {
    if (this.getPlayerByName(playerName).length === 0)
      this._players.push({
        username: playerName,
        socketId,
        score: 0,
        hasCommitted: false,
        isCzar: false,
        host: playerName === this._host,
        cards: [],
        winCards: [],
      });
    return this;
  }

  public leaveGame(playerName: string): Player[] {
    this._players = this._players.filter(
      (player) => player.username !== playerName
    );
    return this._players;
  }

  public getNextRound(playerName: string): any {
    const player = this.getPlayerByName(playerName)[0];

    while (player.cards.length < 7) {
      console.log(`[G] Dealing card to ${playerName}`);
      player.cards.push(this.getWhiteCard());
    }

    return {
      serverState: this.state,
      isCzar: player.isCzar,
      playerCards: player.cards,
      memeCards: player.isCzar ? this.deckMeme : undefined,
    };
  }
}