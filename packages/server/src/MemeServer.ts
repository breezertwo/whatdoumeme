//TODO: Whole API is vulnerable for changed front end data. OK for playing with friends. If ever released as stand alone website: FIX!

import express from 'express';
import path from 'path';
import cookie from 'cookie';
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import cors from 'cors';
import { Db } from 'mongodb';

import Game, { STATES } from './Game';
import * as Utils from './utils';
import { MongoDb, User } from './db';
interface UserData {
  user: User;
  game: Game;
  roomId: string;
}
export class MemeServer {
  private static readonly GAME_RECEIVE_EVENT: string = 'sendGame';
  private static readonly NEW_ROUND_EVENT: string = 'newRound';
  private static readonly GET_PLAYER_EVENT: string = 'playerData';
  private static readonly GET_ROUNDEND_EVENT: string = 'roundEnd';

  private static readonly ON_CONNECTION_LISTENER: string = 'connection';
  private static readonly ON_DSICONNECT_LISTENER: string = 'disconnect';
  private static readonly ON_LEAVEGAME_LISTENER: string = 'leaveGame';
  private static readonly ON_STARTGAME_LISTENER: string = 'startGame';
  private static readonly ON_MEMESELECTED_LISTENER: string = 'confirmMeme';
  private static readonly ON_CARDSELECTCONFIRM_LISTENER: string = 'confirmSelection';
  private static readonly ON_WINNERCONFIRM_LISTENER: string = 'confirmSelectionWinner';
  private static readonly ON_TRADEINCARD_LISTENER: string = 'tradeInCard';

  private static readonly PORT: number = 3030;

  private _app: express.Application;
  private _server: HttpServer;
  private _port: string | number;

  private io: Server;
  private db: Db;

  private activeGames: Map<string, Game>;
  constructor() {
    this._app = express();
    this._port = process.env.PORT || MemeServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this._server = createServer(this._app);

    this._app.use(express.static(path.join(__dirname, 'public')));

    this.activeGames = new Map();

    this.initDb();
    this.initSocket();
    this.listen();
  }

  get app(): express.Application {
    return this._app;
  }

  private initSocket(): void {
    this.io = new Server(this._server);
  }

  private async initDb(): Promise<void> {
    const mongo = new MongoDb();
    await mongo.connect();
    this.db = mongo.getDb();
  }

  private listen(): void {
    this._server.listen(this._port, () => {
      console.log('[MS] Running server on port %s', this._port);
    });

    this.io.on(MemeServer.ON_CONNECTION_LISTENER, async (socket: Socket) => {
      console.log(`[MS] ${socket.id} connected on port ${this._port}.`);

      let game;
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      const userDb = await this.getUser(cookies.userName);

      if (userDb) {
        const username = userDb.username;
        const roomId = cookies.roomId || (socket.handshake.query.roomId as string);

        if (roomId === ':create') {
          game = new Game(username);
          this.activeGames.set(game.id, game);
        } else if (roomId) {
          game = this.activeGames.get(roomId.toUpperCase());
        }

        if (game) {
          game.joinGame(username, socket.id);
          socket.join(game.id);

          switch (game.state) {
            case STATES.WAITING:
              socket.emit(MemeServer.GAME_RECEIVE_EVENT, {
                id: game.id,
                state: game.state,
                playerData: game.getFrontendPlayerData(),
              });

              socket.broadcast
                .to(game.id)
                .emit(MemeServer.GET_PLAYER_EVENT, game.getFrontendPlayerData());

              break;
            case STATES.STARTED:
            case STATES.ANSWERS:
            case STATES.MEMELORD:
              const player = game.getPlayerByName(username);

              if (player.length) {
                if (!player[0].hasCommitted)
                  socket.emit(MemeServer.NEW_ROUND_EVENT, game.getRound(username));
                else {
                  socket.emit(MemeServer.NEW_ROUND_EVENT, {
                    ...game.getRound(username),
                    serverState: STATES.COMITTED,
                  });
                }

                socket.emit(MemeServer.GET_PLAYER_EVENT, game.getFrontendPlayerData());
              }
              break;
            default:
              console.log('[S] Connection error');
              break;
          }
        }
      }

      socket.on(MemeServer.ON_LEAVEGAME_LISTENER, async (data, callback) => {
        const { user, game } = await this.getUserData(data);

        if (user) {
          if (game) {
            game.leaveGame(user.username);
            socket.leave(game.id);
            callback();

            this.io.to(game.id).emit(MemeServer.GET_PLAYER_EVENT, game.getFrontendPlayerData());

            if (game.players.length === 0) {
              this.activeGames.delete(game.id);
            }
          }
        }
      });

      socket.on(MemeServer.ON_STARTGAME_LISTENER, async (data) => {
        const { game } = await this.getUserData(data);

        if (game) {
          game.initGame(2);
          this.io.to(game.id).emit(MemeServer.GET_PLAYER_EVENT, game.getFrontendPlayerData());
          emitRoundToAllPlayersInGame(game, MemeServer.NEW_ROUND_EVENT);
        }
      });

      socket.on(MemeServer.ON_TRADEINCARD_LISTENER, async (data) => {
        const { user, game } = await this.getUserData(data);

        if (game) {
          const opState = game.renewPlayerCards(user.username);
          if (opState) {
            socket.emit(MemeServer.GET_PLAYER_EVENT, game.getFrontendPlayerData());
            socket.emit(MemeServer.NEW_ROUND_EVENT, game.getRound(user.username));
          }
        }
      });

      socket.on(MemeServer.ON_MEMESELECTED_LISTENER, async (data) => {
        const { game } = await this.getUserData(data);

        if (game) {
          game.setSelectedMeme(data.cardId);
          emitRoundToAllPlayersInGame(game, MemeServer.NEW_ROUND_EVENT);
        }
      });

      socket.on(MemeServer.ON_CARDSELECTCONFIRM_LISTENER, async (data, callback) => {
        const { user, game } = await this.getUserData(data);

        if (game) {
          game.setSelectedPlayerCard(user.username, data.cardId);
          if (game.state === STATES.ANSWERS) {
            callback('');
            emitRoundToAllPlayersInGame(game, MemeServer.NEW_ROUND_EVENT);
          } else {
            callback(await Utils.getRandomRedditMeme(this.db));
          }
        }
      });

      socket.on(MemeServer.ON_WINNERCONFIRM_LISTENER, async (data) => {
        const { game } = await this.getUserData(data);

        if (game) {
          const result = game.setWinningCard(data.cardId);
          emitRoundToAllPlayersInGame(game, MemeServer.NEW_ROUND_EVENT, { winner: result.winner });

          if (result.hasRoundEnded) {
            game.startNewRound();
            setTimeout(() => {
              emitRoundToAllPlayersInGame(game, MemeServer.NEW_ROUND_EVENT);
            }, 10000);
          } else {
            this.io.to(game.id).emit(MemeServer.GET_ROUNDEND_EVENT);
          }

          this.io.to(game.id).emit(MemeServer.GET_PLAYER_EVENT, game.getFrontendPlayerData());
        }
      });

      socket.on(MemeServer.ON_DSICONNECT_LISTENER, function () {
        console.log(`[MS] ${socket.id} disconnected`);
      });

      const emitRoundToAllPlayersInGame = (
        game: Game,
        event: string,
        extRoundData?: Record<string, unknown>
      ): void => {
        for (const player of game.players) {
          if (player.socketId == socket.id)
            socket.emit(event, {
              ...game.getRound(player.username),
              ...extRoundData,
            });
          else
            socket.to(player.socketId).emit(event, {
              ...game.getRound(player.username),
              ...extRoundData,
            });
        }
      };
    });
  }

  // Just a barebones MonogoDB Test for potential user data storage in future
  private async getUser(username: string): Promise<User> {
    const coll = this.db.collection('users');
    let user = await coll.findOne<User>({ username });
    if (!user) {
      const newUser = {
        username,
      };
      user = (await coll.insert(newUser)).ops[0];
    }
    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getUserData(data: any): Promise<UserData> {
    const user = data.senderId ? await this.getUser(data.senderId) : undefined;
    const roomId = data.roomId || undefined;
    const game = this.activeGames.get(roomId as string);

    return { user, game, roomId };
  }
}
