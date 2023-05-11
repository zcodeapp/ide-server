import {
  SubscribeMessage,
  WebSocketGateway as NestWebSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@NestWebSocket({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ping')
  async ping(): Promise<{ value: string }> {
    return {
      value: 'pong'
    };
  }
}