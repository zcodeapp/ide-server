import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ApiController } from '../../src/api/api.controller';
import { ApiModule } from '../../src/api/api.module';
import { ApiService } from '../../src/api/api.service';
import { Package } from '../../src/utils/package/package';
import * as request from 'supertest';
import * as fs from 'fs';
import { IPackageInfo } from '../../src/utils/package/package.interface';
import axios from 'axios';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';

const {
  DOCKER_HOSTNAME
} = process.env;

console.log('DOCKER_HOSTNAME', {
  DOCKER_HOSTNAME
});

const host = DOCKER_HOSTNAME ? DOCKER_HOSTNAME : 'localhost:4000'

const client = axios.create({
  baseURL: `http://${host}`,
  headers: {
    'Connection': 'close'
  }
});

describe('api/api.module (e2e)', () => {
  let app: INestApplication;
  const file = fs.readFileSync('package.json').toString();
  const info: IPackageInfo = JSON.parse(file);

  beforeEach(async () => {
    if (!DOCKER_HOSTNAME) {
      app = await NestFactory.create(AppModule);
      await app.listen(4000);
    }
  });

  afterEach(async () => {
    if (!DOCKER_HOSTNAME) {
      await app.close();
    }
  });

  it('Test get state', async () => {
    const result = await client.get('/');

    expect(result.status).toBe(200);
    expect(result.statusText).toBe('OK');
    expect(result.data.running).toBe(true);
    expect(result.data.version).toBe(info.version);
  })

  it('get 404 page', async () => {
    client.get('/404')
      .then(() => {
        expect(true).toBe(false);
      })
      .catch(e => {
        if (DOCKER_HOSTNAME) {
          expect(e.response.status).toBe(404)
        } else {
          expect(e.code).toBe('ERR_BAD_REQUEST')
        }
      })
  });

  it('get not found page with random', async () => {
    client.get(`/${Math.random()}-${Math.random()}-${Math.random()}`)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch(e => {
        if (DOCKER_HOSTNAME) {
          expect(e.response.status).toBe(404)
        } else {
          expect(e.code).toBe('ERR_BAD_REQUEST')
        }
      })
  });
});
