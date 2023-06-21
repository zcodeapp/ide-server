import { Logger, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { Package } from '../utils/package/package';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  controllers: [ApiController],
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 2,
    }),
  ],
  providers: [
    Package,
    ApiService,
    Logger,
    {
      provide: 'getDate',
      useValue: () => {
        return new Date();
      },
    },
  ],
})
export class ApiModule {}
