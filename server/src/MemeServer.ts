//TODO: Whole API is vulnerable for changed front end data. OK for playing with friends. If ever released as stand alone website: FIX!

import express from 'express';
import cookie from 'cookie';
import { connect } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import cors from 'cors';

import User, { IUser } from './db/userSchema';
import Game, { STATES } from './Game';

interface UserData {
  user: IUser;
  game: Game;
  roomId: string;
}
export class MemeServer {
  private static readonly GAME_RECEIVE_EVENT: string = 'sendGame';
  private static readonly NEW_ROUND_EVENT: string = 'newRound';
  private static readonly GET_PLAYER_EVENT: string = 'playerData';

  private static readonly ON_CONNECTION_LISTENER: string = 'connection';
  private static readonly ON_DSICONNECT_LISTENER: string = 'disconnect';
  private static readonly ON_LEAVEGAME_LISTENER: string = 'leaveGame';
  private static readonly ON_STARTGAME_LISTENER: string = 'startGame';
  private static readonly ON_MEMESELECTED_LISTENER: string = 'confirmMeme';
  private static readonly ON_CARDSELECTCONFIRM_LISTENER: string = 'confirmSelection';
  private static readonly ON_WINNERCONFIRM_LISTENER: string = 'confirmSelectionWinner';

  private static readonly PORT: number = 3030;

  private _app: express.Application;
  private _server: HttpServer;
  private _port: string | number;

  private io: Server;

  private activeGames: Map<string, Game>;
  constructor() {
    this._app = express();
    this._port = process.env.PORT || MemeServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this._server = createServer(this._app);

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
    await connect(
      'mongodb://localhost:27017/whatdoumeme',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log('[DB] Connection established');
      }
    );
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
        const roomId = cookies.roomId || socket.handshake.query.roomId;

        if (roomId === ':create') {
          game = new Game(username);
          this.activeGames.set(game.id, game);
        } else if (roomId) {
          game = this.activeGames.get(roomId as string);
        }

        if (game) {
          game.joinGame(username, socket.id);
          socket.join(game.id);

          const player = game.getPlayerByName(username);
          if (game.state === STATES.WAITING) {
            socket.emit(MemeServer.GAME_RECEIVE_EVENT, game);
            socket.broadcast.to(game.id).emit(MemeServer.GET_PLAYER_EVENT, game.players);
          } else if (
            (game.state === STATES.STARTED ||
              game.state === STATES.ANSWERS ||
              game.state === STATES.MEMELORD) &&
            player.length
          ) {
            if (!player[0].hasCommitted)
              socket.emit(MemeServer.NEW_ROUND_EVENT, game.getRound(username));
            else
              socket.emit(MemeServer.NEW_ROUND_EVENT, {
                ...game.getRound(username),
                serverState: STATES.COMITTED,
              });
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

            this.io.to(game.id).emit(MemeServer.GET_PLAYER_EVENT, game.players);
          }
        }
      });

      socket.on(MemeServer.ON_STARTGAME_LISTENER, async (data) => {
        const { game } = await this.getUserData(data);

        if (game) {
          game.initGame();
          emitRoundToAllPlayersInGame(game, MemeServer.NEW_ROUND_EVENT);
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
          callback();
          if (game.state === STATES.ANSWERS) {
            emitRoundToAllPlayersInGame(game, MemeServer.NEW_ROUND_EVENT);
          }
        }
      });

      socket.on(MemeServer.ON_WINNERCONFIRM_LISTENER, async (data) => {
        const { game } = await this.getUserData(data);

        if (game) {
          const startNewRound = game.setWinningCard(data.cardId);
          emitRoundToAllPlayersInGame(game, MemeServer.NEW_ROUND_EVENT);

          if (startNewRound) {
            game.startNewRound();
            setTimeout(() => {
              emitRoundToAllPlayersInGame(game, MemeServer.NEW_ROUND_EVENT);
            }, 10000);
          }
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
  private async getUser(username: string): Promise<IUser> {
    let user = await User.findOne({ username }).exec();
    if (user === null) {
      const newUser = new User({
        username,
      });
      user = await newUser.save();
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
