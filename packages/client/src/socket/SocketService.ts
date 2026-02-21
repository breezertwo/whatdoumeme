import { io, Socket } from 'socket.io-client';

export interface ConnectOptions {
  roomId: string;
}

export class SocketService {
  private socket: Socket | null = null;

  connect(url: string, options: ConnectOptions): void {
    console.log('Connecting to', url, this.socket?.connected);
    if (this.socket?.connected) this.socket.disconnect();

    this.socket = io(url, {
      transports: ['websocket'],
      query: { roomId: options.roomId },
      withCredentials: true,
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  get connected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Subscribe to a server event. Returns an unsubscribe function so callers
   * can return it directly from useEffect without manual socket.off() calls.
   */
  on<T>(event: string, handler: (data: T) => void): () => void {
    this.socket?.on(event, handler);
    return () => {
      this.socket?.off(event, handler);
    };
  }

  emit<T>(event: string, payload?: T): void {
    this.socket!.emit(event, payload ?? {});
  }

  /**
   * Emit an event and return a Promise that resolves with the server ack value.
   * Rejects immediately if the socket is not connected.
   */
  emitWithAck<TPayload, TAck>(event: string, payload: TPayload): Promise<TAck> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }
      this.socket.emit(event, payload, (ack: TAck) => resolve(ack));
    });
  }
}

/** Singleton — shared between SocketProvider and all hooks. */
export const socketService = new SocketService();
