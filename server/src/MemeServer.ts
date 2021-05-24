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

      console.log(`[I] ${socket.id} connected on port ${this.port}.`);

      let game;
      const userDb = await this.getUser(cookies.userName);

      if (userDb) {
        const username = userDb.username;

        const roomId = cookies.roomId || socket.handshake.query.roomId;

        if (roomId === ':create') {
          game = new Game();
          this.activeGames.set(game.id, game);
        } else if (roomId) {
          game = this.activeGames.get(roomId as string);
        }

        if (game) {
          console.log(socket.rooms);
          game.joinGame(username);
          socket.join(game.id);
          console.log(socket.rooms);

          socket.emit(this.GAME_RECIVE_EVENT, game);
          if (game.state === STATES.WAITING)
            socket.broadcast.to(game.id).emit('playerData', game.players);
        }
      }

      socket.on('leaveGame', async (data, fn) => {
        console.log(`[I] ${data.senderId} will leave`);

        const userDb = await this.getUser(data.senderId);
        if (userDb) {
          const username = userDb.username;

          const roomId = data.roomId;
          const game = this.activeGames.get(roomId as string);

          if (game) {
            console.log(socket.rooms);
            game.leaveGame(username);
            socket.leave(game.id);
            fn();
            console.log(socket.rooms);

            this.io.to(game.id).emit('playerData', game.players);
          }
        }
      });

      socket.on('disconnect', function () {
        console.log(`[I] ${socket.id} disconnected`);
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
