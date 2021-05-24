import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import cors from 'cors';

export class MemeServer {
  public static readonly PORT: number = 3030;
  private _app: express.Application;
  private server: HttpServer;
  private io: Server;
  private port: string | number;

  constructor() {
    this._app = express();
    this.port = process.env.PORT || MemeServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
  }

  private initSocket(): void {
    this.io = new Server(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('Connected client on port %s.', this.port);

      console.log(socket.id + ' connected');
      console.log(socket.handshake.query.roomId);

      console.log(socket.rooms);
      socket.join(socket.handshake.query.roomId);
      console.log(socket.rooms);

      socket.on('disconnect', function () {
        console.log('this never gets called');
      });
    });
  }

  get app(): express.Application {
    return this._app;
  }
}
