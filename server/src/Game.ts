import deepcopy from 'deepcopy';
import { deck } from './db/gameData';
import { MemeCard, RoundData, WhiteCard } from './interfaces/game';
import * as Utils from './utils';

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
  WINNER = 5,
}

export default class Game {
  private readonly _id: string;
  private readonly _host: string;

  private readonly MAX_SCORE: number;

  private _players: Player[] = [];

  private _STATE: STATES;

  private deckMeme: MemeCard[];
  private deckCards: WhiteCard[];

  private selectedMeme: MemeCard;
  private currentPlayedCards: (WhiteCard & { owner: string })[];

  constructor(host: string) {
    this._STATE = STATES.WAITING;
    this._id = Utils.generateUniqueId();
    this._host = host;
    this.MAX_SCORE = 2;

    this.deckMeme = [];
    this.deckCards = [];

    this.selectedMeme = undefined;
    this.currentPlayedCards = [];

    this.copyDeck();
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
    this._players[Math.floor(Math.random() * this._players.length)].isCzar = true;
    this._STATE = STATES.MEMELORD;

    console.log(`[MS] ${this.id}: Game started`);
  }

  public getPlayerByName(playerName: string): Player[] {
    return this._players.filter((player) => player.username === playerName);
  }

  private shuffleToPlayer(amount: number): void {
    //TODO: Enough cards for players check
    //if (this.players.length * amount < this.deck.whiteCards.length) {
    for (let i = 0; i < amount; i++) {
      for (const player of this._players) {
        player.cards.push(this.deckCards.popRandom());
      }
    }
    //}
  }

  private copyDeck(): void {
    const _deck = deepcopy(deck);

    this.deckMeme = _deck.memeCards;
    this.deckCards = _deck.whiteCards;
  }

  private getWhiteCard(): WhiteCard {
    //if (this.players.length * amount < this.deck.whiteCards.length)
    return this.deckCards.splice((this.deckCards.length * Math.random()) | 0, 1)[0];
  }

  public joinGame(playerName: string, socketId: string): void {
    const player = this.getPlayerByName(playerName);
    if (!player.length) {
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
      console.log(`[G] ${playerName} joined game ${this.id}.`);
    } else if (player.length && player[0].socketId != socketId) {
      player[0].socketId = socketId;
      console.log(`[G] ${player[0].username} rejoined game ${this.id} with socketId ${socketId}.`);
    }
  }

  public leaveGame(playerName: string): Player[] {
    this._players = this._players.filter((player) => player.username !== playerName);
    console.log(`[G] ${playerName} left game ${this.id}`);

    return this._players;
  }

  public getRound(playerName: string): RoundData {
    const player = this.getPlayerByName(playerName)[0];

    return {
      serverState: this.state,
      isCzar: player.isCzar,
      playerCards: this._STATE !== STATES.ANSWERS ? player.cards : this.currentPlayedCards,
      currentMeme: this.selectedMeme ? this.selectedMeme.name : undefined,
      memeCards: player.isCzar && this._STATE === STATES.MEMELORD ? this.deckMeme : undefined,
    };
  }

  public setSelectedMeme(cardId: string): MemeCard {
    this.deckMeme.forEach((card, index) => {
      if (card.cardId === cardId) {
        this.selectedMeme = this.deckMeme.splice(index, 1)[0];
      }
    });
    this._STATE = STATES.STARTED;
    return this.selectedMeme;
  }

  public setSelectedPlayerCard(playerName: string, cardId: string): void {
    const player = this.getPlayerByName(playerName)[0];
    //const card = removeItemAndReturn(player.cards, (card) => card.cardId === cardId);
    const card = player.cards.removeAndReturn((card) => card.cardId === cardId);

    player.hasCommitted = true;
    this.currentPlayedCards.push({ ...card, owner: player.username });

    console.log(`[G] ${player.username} choose card ${card.cardId}`);

    if (this.currentPlayedCards.length === this.players.length - 1) {
      console.log(`[G] ${this._id} round ended`);
      this._STATE = STATES.ANSWERS;
    }
  }

  public setWinningCard(cardId: string): boolean {
    this.currentPlayedCards = this.currentPlayedCards.filter((card) => card.cardId === cardId);
    const winningPlayer = this.getPlayerByName(this.currentPlayedCards[0].owner)[0];

    winningPlayer.score++;
    winningPlayer.winCards.push(this.selectedMeme);

    if (winningPlayer.score >= this.MAX_SCORE) {
      console.log(`[G] ${winningPlayer.username} won game ${this._id}`);
      return false;
    }
    return true;
  }

  public startNewRound(): void {
    const nextCzar = this._players.cycle((player) => player.isCzar === true);

    this._players.forEach((player) => {
      if (player.isCzar) {
        player.isCzar = false;
      }
      player.hasCommitted = false;

      while (player.cards.length < 7) {
        console.log(`[G] Dealing card to ${player.username}`);
        player.cards.push(this.getWhiteCard());
      }
    });

    nextCzar.isCzar = true;

    console.log(`[G] ${nextCzar.username} is next Czar of game`);

    this.selectedMeme = undefined;
    this.currentPlayedCards = [];
    this._STATE = STATES.MEMELORD;

    console.log(`[G] ${this.id} starting new round in 10 sec`);
  }
}
