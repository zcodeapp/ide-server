import { Logger, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { Package } from '../utils/package/package';

@Module({
  controllers: [ApiController],
  providers: [
    Package,
    ApiService,
    Logger,
    {
      provide: 'getDate',
      useValue: () => {
        return new Date()
      },
    },
  ],
})
export class ApiModule {}
