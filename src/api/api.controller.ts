import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller({})

export class ApiController {

    constructor(
        private _apiService: ApiService
    ){}

    @Get()
    async getState() {
        const version = await this._apiService.getPackageInfo();
        return {
            running: true,
            version: version.version,
            date: new Date()
        };
    }
}