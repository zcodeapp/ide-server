import { Logger, Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';
import { Package } from '../../utils/package/package';
import { Authorizer } from '../authorizer/authorizer';

@Module({
  // imports: [
  //   ThrottlerModule.forRoot({
  //     ttl: 60,
  //     limit: 2,
  //   }),
  // ],
  providers: [
    Package,
    Logger,
    Authorizer,
    {
      provide: 'SERVER_KEY',
      useValue: process.env.SERVER_KEY,
    },
    WebSocketService,
    WebSocketGateway,
  ],
})
export class WebSocketModule {}
