import { Injectable } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimit {
  constructor(
    private _rateLimiterMemory: RateLimiterMemory,
    private _points: number = 1,
  ) {}

  async test(address: string): Promise<boolean> {
    try {
      const result = await this._rateLimiterMemory.consume(
        address,
        this._points,
      );
      if (result.remainingPoints > 0) {
        return false;
      }
    } catch (e) {}
    return true;
  }
}
