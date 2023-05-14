import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WebSocketModule,
  ],
  providers: [
    Logger,
  ],
})
export class AppModule {}
