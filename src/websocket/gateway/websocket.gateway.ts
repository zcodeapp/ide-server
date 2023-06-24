import {
  SubscribeMessage,
  WebSocketGateway as NestWebSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IPackageInfo } from '../../utils/package/package.interface';
import { WebSocketService } from './websocket.service';
import { Authorizer } from '../../plugins/authorizer/authorizer';
import { RateLimit } from '../../plugins/rate/limit';

@NestWebSocket({
  cors: {
    origin: '*',
  },
})
// @UseInterceptors(WebSocketDDoSInterceptor)
export class WebSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly _webSocketService: WebSocketService,
    private readonly _authorizer: Authorizer,
    private readonly _rateLimit: RateLimit,
  ) {}

  async handleConnection(client: Socket) {
    const address = client.handshake.address;
    const isBlocked = await this._rateLimit.test(address);
    const key = client.handshake.auth?.key;
    if (isBlocked) {
      client.emit(
        'system_error',
        JSON.stringify({
          context: 'connect',
          message: 'server_many_connections',
          params: {},
        }),
      );
      client.disconnect();
      return;
    }
    if (!key || !(await this._authorizer.validateKey(key))) {
      client.emit(
        'system_error',
        JSON.stringify({
          context: 'connect',
          message: 'server_key_not_valid',
          params: {
            key: key ?? null,
          },
        }),
      );
      client.disconnect();
      return;
    }
    client.emit('connected');
  }

  @SubscribeMessage('version')
  async handleVersion(): Promise<IPackageInfo> {
    return this._webSocketService.getPackageInfo();
  }
}
