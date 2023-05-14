import { Logger, Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { Package } from '../utils/package/package';
import { WebSocketService } from './websocket.service';

@Module({
  providers: [
    Package,
    WebSocketService,
    WebSocketGateway,
    Logger,
  ],
})
export class WebSocketModule {}