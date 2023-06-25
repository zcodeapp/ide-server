import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebSocketModule } from './websocket/gateway/websocket.module';
import { ApiModule } from './api/api.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    WebSocketModule,
    ApiModule,
  ],
})
export class AppModule {}
