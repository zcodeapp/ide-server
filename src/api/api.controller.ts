import { Controller, Get } from '@nestjs/common';

@Controller({})

export class ApiController {

    @Get()
    getState() {
        return {
            "running": true
        };
    }
}