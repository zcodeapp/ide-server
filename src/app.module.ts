import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebSocketModule } from './websocket/websocket.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ConfigModule.forRoot(), WebSocketModule, ApiModule],
  providers: [Logger],
})
export class AppModule {}
