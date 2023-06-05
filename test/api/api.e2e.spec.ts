import { INestApplication, Logger } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ApiController } from "../../src/api/api.controller";
import { ApiModule } from "../../src/api/api.module";
import { ApiService } from "../../src/api/api.service";
import { Package } from "../../src/utils/package/package";
import * as request from 'supertest';
import * as fs from 'fs';
import { IPackageInfo } from "src/utils/package/package.interface";

async function createNestApp(...providers): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers,
  }).compile();
  const app = testingModule.createNestApplication();
  await app.init();
  return app;
}

describe('api/api.module (e2e)', () => {

  let app: INestApplication;
  const date = new Date();
  const file = fs.readFileSync('package.json').toString();
  const info: IPackageInfo = JSON.parse(file);

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [
      ],
      providers: [
        Package,
        Logger,
        ApiService,
        ApiModule,
        {
          provide: 'getDate',
          useValue: () => {
            return date
          },
        }
      ],
      controllers: [
        ApiController,
      ]
    }).compile();
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterEach( async () => {
    await app.close();
  });

  it('get state', async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(JSON.stringify({ running: true, version: info.version, date }));
  });

  it('get not found page', async () => {
    return request(app.getHttpServer())
      .get('/404')
      .expect(404)
  });

  it('get not found page with random', async () => {
    return request(app.getHttpServer())
      .get(`/${Math.random()}`)
      .expect(404)
  });

});