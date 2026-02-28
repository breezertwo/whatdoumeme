//TODO: Whole API is vulnerable for changed front end data. OK for playing with friends. If ever released as stand alone website: FIX!

import express from 'express';
import path from 'path';
import * as cookie from 'cookie';
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import cors from 'cors';

import { STATES } from './Game';
import { AppDatabase } from './db';
import { GameRoomManager } from './GameRoomManager';
import { GameSocketHandler } from './socket/GameSocketHandler';
import { ServerEvent } from './socket/events';

export class MemeServer {
  private static readonly PORT: number = 3030;

  private _app: express.Application;
  private _server: HttpServer;
  private _port: string | number;

  private io: Server;
  private db: AppDatabase;
  private rooms: GameRoomManager;

  constructor() {
    this._app = express();
    this._port = process.env.PORT || MemeServer.PORT;
    this._app.use(cors());

    this._server = createServer(this._app);
    this._app.use(express.static(path.join(__dirname, 'public')));
    this._app.get('/join', (req, res) => this.joinGameLink(req, res));

    this.db = new AppDatabase();
    this.rooms = new GameRoomManager(this.db);
    this.io = new Server(this._server);

    this.listen();
  }

  get app(): express.Application {
    return this._app;
  }

  private listen(): void {
    this._server.listen(this._port, () => {
      console.log('[MS] Running server on port %s', this._port);
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[MS] ${socket.id} connected on port ${this._port}.`);

      // ── Identity resolution ────────────────────────────────────────────────
      // Read the caller's identity from cookies / handshake query.
      // Auth integration point: replace the cookie lookup with a verified token
      // check on socket.handshake.auth.token. socket.data stays the same shape.
      const cookies  = cookie.parse(socket.handshake.headers.cookie || '');
      const userDb   = this.db.getOrCreateUser(cookies.userName);
      if (!userDb) return;

      const username = userDb.username;
      const roomId   = cookies.roomId || (socket.handshake.query.roomId as string);

      // ── Room resolution ────────────────────────────────────────────────────
      const game = roomId === ':create'
        ? this.rooms.createRoom(username)
        : this.rooms.findRoom(roomId);

      if (!game) return;

      game.joinGame(username, socket.id);
      socket.join(game.id);

      // Bind identity to the socket — GameSocketHandler reads from socket.data.
      socket.data.username = username;
      socket.data.roomId   = game.id;

      // Persist the updated player list (new join or rejoined socketId).
      this.rooms.saveRoom(game);

      // ── Initial state emission ─────────────────────────────────────────────
      switch (game.state) {
        case STATES.WAITING:
          socket.emit(ServerEvent.SEND_GAME, {
            id: game.id,
            state: game.state,
            playerData: game.getFrontendPlayerData(),
          });
          socket.broadcast.to(game.id).emit(ServerEvent.PLAYER_DATA, game.getFrontendPlayerData());
          break;

        case STATES.STARTED:
        case STATES.ANSWERS:
        case STATES.MEMELORD: {
          const [player] = game.getPlayerByName(username);
          if (player) {
            socket.emit(ServerEvent.NEW_ROUND, player.hasCommitted
              ? { ...game.getRound(username), serverState: STATES.COMITTED }
              : game.getRound(username),
            );
            socket.emit(ServerEvent.PLAYER_DATA, game.getFrontendPlayerData());
          }
          break;
        }

        default:
          console.log('[MS] Connection during unexpected game state');
      }

      // ── Event listeners ────────────────────────────────────────────────────
      new GameSocketHandler(socket, this.io, this.db, this.rooms).register();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private joinGameLink(req: any, res: any): void {
    const gameId = req.query.id as string;
    const game   = this.rooms.findRoom(gameId);
    if (game) {
      res.cookie('roomId', gameId);
      res.redirect(302, 'http://localhost:8080/');
    } else {
      res.sendStatus(404);
    }
  }
}
