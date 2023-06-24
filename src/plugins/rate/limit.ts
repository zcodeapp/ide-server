import { Injectable } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimit {
  constructor(
    private _rateLimiterMemory: RateLimiterMemory
  ) {}

  async test(address: string): Promise<boolean> {
    try {
      const result = await this._rateLimiterMemory.consume(
        address,
        1,
      );
      if (result.remainingPoints > 0) {
        return false;
      }
    } catch (e) {}
    return true;
  }
}
