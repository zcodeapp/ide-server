import { Logger, Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';
import { Package } from '../../utils/package/package';
import { Authorizer } from '../../plugins/authorizer/authorizer';
import { RateLimit } from '../../plugins/rate/limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const { SERVER_KEY, RATE_POINTS, RATE_DURATION } = process.env;

@Module({
  providers: [
    Package,
    Logger,
    Authorizer,
    {
      provide: 'SERVER_KEY',
      useValue: SERVER_KEY,
    },
    {
      provide: RateLimit,
      useFactory: () => {
        return new RateLimit(
          new RateLimiterMemory({
            points: Number(RATE_POINTS),
            duration: Number(RATE_DURATION),
          }),
          1,
        );
      },
    },
    WebSocketService,
    WebSocketGateway,
  ],
})
export class WebSocketModule {}
