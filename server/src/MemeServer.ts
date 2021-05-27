import express from 'express';
import cookie from 'cookie';
import { connect } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import cors from 'cors';
import User from './db/userSchema';
import { Game, STATES } from './Game';

export class MemeServer {
  private readonly GAME_RECIVE_EVENT: string = 'sendGame';
  private readonly NEW_ROUND_EVENT: string = 'newRound';

  public static readonly PORT: number = 3030;
  private _app: express.Application;
  private server: HttpServer;
  private io: Server;
  private port: string | number;

  private activeGames: Map<string, Game>;

  constructor() {
    this._app = express();
    this.port = process.env.PORT || MemeServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);

    this.initDb();
    this.initSocket();
    this.listen();

    this.activeGames = new Map();
  }

  private initSocket(): void {
    this.io = new Server(this.server);
  }

  private async initDb(): Promise<void> {
    await connect(
      'mongodb://localhost:27017/whatdoumeme',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log('DB Connection established');
      }
    );
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on('connection', async (socket: Socket) => {
      const cookies = cookie.parse(socket.handshake.headers.cookie);

      console.log(`[MS] ${socket.id} connected on port ${this.port}.`);

      let game;
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
          console.log(socket.rooms);
          game.joinGame(username, socket.id);
          socket.join(game.id);
          console.log(socket.rooms);

          if (game.state === STATES.WAITING) {
            socket.emit(this.GAME_RECIVE_EVENT, game);
            socket.broadcast.to(game.id).emit('playerData', game.players);
          } else if (
            game.state === STATES.STARTED &&
            game.getPlayerByName(username).length === 1
          )
            socket.emit(this.NEW_ROUND_EVENT, game.getNextRound(username));
        }
      }

      socket.on('leaveGame', async (data, callback) => {
        const userDb = await this.getUser(data.senderId);
        if (userDb) {
          const username = userDb.username;

          const roomId = data.roomId;
          const game = this.activeGames.get(roomId as string);

          if (game) {
            game.leaveGame(username);
            socket.leave(game.id);
            callback();
            console.log(`[MS] ${data.senderId} left game ${data.roomId}`);

            this.io.to(game.id).emit('playerData', game.players);
          }
        }
      });

      socket.on('startGame', async (data) => {
        //TODO: Not safe for changed data
        const roomId = data.roomId;
        const game = this.activeGames.get(roomId as string);
        if (game) {
          game.initGame();
          for (const player of game.players) {
            if (player.host) {
              socket.emit(
                this.NEW_ROUND_EVENT,
                game.getNextRound(player.username)
              );
            } else {
              socket
                .to(player.socketId)
                .emit(this.NEW_ROUND_EVENT, game.getNextRound(player.username));
            }
          }
          console.log(`[MS] ${data.roomId}: Game started`);
        }
      });

      //socket.on('memeCardSelected', async (data) => {});

      socket.on('disconnect', function () {
        console.log(`[MS] ${socket.id} disconnected`);
      });
    });
  }

  private async getUser(username: string): Promise<any> {
    let doc = await User.findOne({ username }).exec();
    if (doc === null) {
      const newUser = new User({
        username,
      });
      doc = await newUser.save();
    }
    return doc;
  }

  get app(): express.Application {
    return this._app;
  }
}
