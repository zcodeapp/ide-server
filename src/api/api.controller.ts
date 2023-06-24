import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller({})
// @UseGuards(ThrottlerGuard)
export class ApiController {
  constructor(
    private _apiService: ApiService,
    @Inject('getDate') private getDate: () => Date,
  ) {}

  @Get()
  async getState() {
    const version = await this._apiService.getPackageInfo();
    return {
      running: true,
      version: version.version,
      date: this.getDate(),
    };
  }
}
