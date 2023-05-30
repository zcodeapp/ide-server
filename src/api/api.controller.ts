import { Controller, Get, Inject } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller({})
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
