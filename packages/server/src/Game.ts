import deepcopy from 'deepcopy';
import { deck } from './db';
import { MemeCard, RoundData, WhiteCard, Player, BasePlayer } from './interfaces/game';
import * as Utils from './utils';

interface RoundResult {
  hasRoundEnded: boolean;
  winner: string;
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

  private MAX_SCORE: number;
  private readonly HANDCARDS_AMOUNT = 7;

  private _players: Player[] = [];

  private _STATE: STATES;

  private deckMeme: MemeCard[];
  private deckCards: WhiteCard[];

  private selectedMeme: MemeCard;
  private currentPlayedCards: (WhiteCard & { owner: string })[];
  private currentCzar: string;

  constructor(host: string) {
    this._STATE = STATES.WAITING;
    this._id = Utils.generateUniqueId();
    this._host = host;
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

  public initGame(winningScore?: number): void {
    if (winningScore) this.MAX_SCORE = winningScore;

    // TODO: Destinguish reset and new game
    this.resetPlayers();
    this.copyDeck();

    this.selectedMeme = undefined;
    this.currentPlayedCards = [];

    this.shuffleToPlayer();

    // make random player czar
    const czar = this._players.random();
    czar.isCzar = true;
    this.currentCzar = czar.username;
    this._STATE = STATES.MEMELORD;

    console.log(`[MS] ${this.id}: Game started`);
  }

  public getPlayerByName(playerName: string): Player[] {
    return this._players.filter((player) => player.username === playerName);
  }

  private shuffleToPlayer(): void {
    if (this.players.length * this.HANDCARDS_AMOUNT < this.deckCards.length) {
      for (const player of this._players) {
        for (let i = this.HANDCARDS_AMOUNT; i--; ) player.cards.push(this.deckCards.popRandom());
      }
    } else {
      //TODO: Send this to frontend
      console.log('[G] Not enough cards to play with this amount of players');
    }
  }

  public resetPlayers(): void {
    for (const player of this._players) {
      player.score = 0;
      player.tradeOptions = 0;
      player.hasCommitted = false;
      player.isCzar = false;
      player.cards = [];
      player.winCards = [];
    }
  }

  private copyDeck(): void {
    const _deck = deepcopy(deck);

    this.deckMeme = _deck.memeCards;
    this.deckCards = _deck.whiteCards;
  }

  private getWhiteCard(): WhiteCard | undefined {
    return this.deckCards.length > 0
      ? this.deckCards.splice((this.deckCards.length * Math.random()) | 0, 1)[0]
      : undefined;
  }

  public joinGame(playerName: string, socketId: string): void {
    const player = this.getPlayerByName(playerName);
    if (!player.length) {
      this._players.push({
        username: playerName,
        socketId,
        score: 0,
        tradeOptions: 0,
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
      playerCards:
        this._STATE === STATES.ANSWERS || this._STATE === STATES.WINNER
          ? this.currentPlayedCards
          : player.cards,
      currentMeme: this.selectedMeme ? this.selectedMeme.name : undefined,
      currentCzar: this.currentCzar,
      memeCards:
        player.isCzar && this._STATE === STATES.MEMELORD
          ? Utils.getRandomElementsNonDestructive(this.deckMeme, 5)
          : undefined,
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
    const card = player.cards.removeAndReturn((card) => card.cardId === cardId);

    player.hasCommitted = true;
    this.currentPlayedCards.push({ ...card, owner: player.username });

    console.log(`[G] ${player.username} choose card ${card.cardId}`);

    if (this.currentPlayedCards.length === this.players.length - 1) {
      console.log(`[G] ${this._id} round ended`);
      this._STATE = STATES.ANSWERS;
    }
  }

  public setWinningCard(cardId: string): RoundResult {
    this.currentPlayedCards = this.currentPlayedCards.filter((card) => card.cardId === cardId);
    const winningPlayer = this.getPlayerByName(this.currentPlayedCards[0].owner)[0];

    winningPlayer.score++;
    winningPlayer.tradeOptions++;
    winningPlayer.winCards.push(this.selectedMeme);

    this._STATE = STATES.WINNER;

    if (winningPlayer.score >= this.MAX_SCORE) {
      console.log(`[G] ${winningPlayer.username} won game ${this._id}`);
      return { hasRoundEnded: false, winner: winningPlayer.username };
    }
    return { hasRoundEnded: true, winner: winningPlayer.username };
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
    this.currentCzar = nextCzar.username;

    console.log(`[G] ${this.currentCzar} is next Czar of game`);

    this.selectedMeme = undefined;
    this.currentPlayedCards = [];
    this._STATE = STATES.MEMELORD;

    console.log(`[G] ${this.id} starting new round in 10 sec`);
  }

  public getFrontendPlayerData(): BasePlayer[] {
    const strippedPlayers = [];
    for (const player of this._players) {
      const { username, score, tradeOptions, host, isCzar } = player;
      strippedPlayers.push({ username, score, tradeOptions, host, isCzar });
    }
    return strippedPlayers;
  }

  public renewPlayerCards(playerName: string): boolean {
    const player = this.getPlayerByName(playerName)[0];

    if (player.tradeOptions > 0) {
      player.tradeOptions--;

      const tempCards = player.cards;
      player.cards = [];

      for (let i = this.HANDCARDS_AMOUNT; i--; ) player.cards.push(this.deckCards.popRandom());

      this.deckCards = [...this.deckCards, ...tempCards];

      return true;
    }

    return false;
  }
}
