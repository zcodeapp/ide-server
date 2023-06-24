import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { WebSocketGateway } from '../../src/websocket/gateway/websocket.gateway';
import { Socket, io } from 'socket.io-client';
import { WebSocketService } from '../../src/websocket/gateway/websocket.service';
import { Package } from '../../src/utils/package/package';
import { IPackageInfo } from '../../src/utils/package/package.interface';
import { WebSocketAdapter } from '../../src/adapters/websocket.adapter';
import * as fs from 'fs';
import { Authorizer } from '../../src/plugins/authorizer/authorizer';
import { RateLimit } from '../../src/plugins/rate/limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const { DOCKER_HOSTNAME, DOCKER_SERVER_KEY } = process.env;

let server_key = '355b5636-3c3e-4e57-97ad-5e1dd40283a2';
let host = 'ws://localhost:4000';
if (DOCKER_HOSTNAME) {
  host = `ws://${DOCKER_HOSTNAME}`;
  if (DOCKER_SERVER_KEY) {
    server_key = DOCKER_SERVER_KEY;
  }
}

console.log('DOCKER_HOSTNAME', {
  DOCKER_HOSTNAME,
});

async function createNestApp(...gateways): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  const app = testingModule.createNestApplication();
  app.useWebSocketAdapter(new WebSocketAdapter(await app.resolve(Logger), app));
  return app;
}

describe('websocket/websocket.module (e2e)', () => {
  let ws: Socket, app: INestApplication;

  beforeAll(async () => {
    if (!DOCKER_HOSTNAME) {
      app = await createNestApp(
        Package,
        Logger,
        Authorizer,
        {
          provide: RateLimit,
          useFactory: () => {
            return new RateLimit(
              new RateLimiterMemory({
                points: 100,
                duration: 1,
              }),
            );
          },
        },
        {
          provide: 'SERVER_KEY',
          useValue: server_key,
        },
        WebSocketService,
        WebSocketGateway,
      );
      await app.listen(4000);
    }
  });

  afterAll(async () => {
    if (!DOCKER_HOSTNAME) {
      await app.close();
    }
  });

  it('test try connect with valid server key', async () => {
    const result = {
      connected: false,
    };

    ws = io(host, {
      auth: {
        key: server_key,
      },
    });
    await new Promise<void>((resolve, error) => {
      ws.on('connect', () => {
        ws.emit('version', () => {
          result.connected = true;
          resolve();
        });
      });
      ws.on('error', () => {
        error();
      });
    });
    ws.close();

    expect(result.connected).toBeTruthy();
  });

  it('test try connect with invalid server key', async () => {
    const result = {
      hasError: false,
      getVersion: false,
    };

    ws = io(host, {
      auth: {
        key: 'invalid key',
      },
    });

    await new Promise<void>((resolve, error) => {
      ws.on('connect', () => {
        ws.emit('version', () => {
          result.getVersion = true;
          error();
        });
        ws.on('disconnect', () => {
          result.hasError = true;
          resolve();
        });
      });
    });
    ws.close();

    expect(result.hasError).toBeTruthy();
    expect(result.getVersion).toBeFalsy();
  });

  it('test try connect with empty server key', async () => {
    const result = {
      hasError: false,
      getVersion: false,
    };

    ws = io(host);

    await new Promise<void>((resolve, error) => {
      ws.on('connect', () => {
        ws.emit('version', () => {
          result.getVersion = true;
          error();
        });
        ws.on('disconnect', () => {
          result.hasError = true;
          resolve();
        });
      });
    });
    ws.close();

    expect(result.hasError).toBeTruthy();
    expect(result.getVersion).toBeFalsy();
  });

  it(`test get current version version`, async () => {
    const file = fs.readFileSync('package.json').toString();
    const info: IPackageInfo = JSON.parse(file);
    let version: IPackageInfo = {
      name: '',
      version: '',
      dependencies: {},
      devDependencies: {},
    };
    ws = io(host, {
      auth: {
        key: server_key,
      },
    });
    try {
      await new Promise<void>((resolve) =>
        ws.on('connect', () => {
          ws.emit('version', (_version) => {
            version = _version;
            resolve();
          });
          ws.on('system_error', (a) => {
            console.log('error', { a });
          });
        }),
      );
      expect(version.name).toBe(info.name);
      expect(version.version).toBe(info.version);
      expect(version.dependencies).toStrictEqual(info.dependencies);
      expect(version.devDependencies).toStrictEqual(info.devDependencies);
    } catch (e) {
      throw e;
    } finally {
      ws.close();
    }
  });
});
