import {
  SubscribeMessage,
  WebSocketGateway as NestWebSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IPackageInfo } from '../utils/package/package.interface';
import { WebSocketService } from './websocket.service';

@NestWebSocket({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly _webSocketService: WebSocketService) {}

  @SubscribeMessage('version')
  async version(): Promise<IPackageInfo> {
    return this._webSocketService.getPackageInfo();
  }
}
