import { Logger, Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { Package } from "src/utils/package/package";

@Module({
  controllers: [
    ApiController
  ],
  providers: [Package, ApiService, Logger],
})
export class ApiModule {}