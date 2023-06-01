import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { WebSocketGateway } from '../../src/websocket/websocket.gateway';
import { Socket, io } from 'socket.io-client';
import { WebSocketService } from '../../src/websocket/websocket.service';
import { Package } from '../../src/utils/package/package';
import { IPackageInfo } from '../../src/utils/package/package.interface';
import { WebSocketAdapter } from '../../src/adapters/websocket.adapter';
import * as fs from 'fs';

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

  beforeEach(async () => {
    app = await createNestApp(
      Logger,
      Package,
      WebSocketService,
      WebSocketGateway,
    );
    await app.listen(4000);
  });

  afterEach(async () => {
    await app.close();
  });

  it(`get version`, async () => {
    const file = fs.readFileSync('package.json').toString();
    const info: IPackageInfo = JSON.parse(file);
    let version: IPackageInfo = {
      name: '',
      version: '',
      dependencies: {},
      devDependencies: {},
    };

    ws = io('ws://localhost:4000');
    await new Promise<void>((resolve) =>
      ws.on('connect', () => {
        ws.emit('version', (_version) => {
          version = _version;
          resolve();
        });
      }),
    );
    ws.close();
    expect(version.name).toBe(info.name);
    expect(version.version).toBe(info.version);
    expect(version.dependencies).toStrictEqual(info.dependencies);
    expect(version.devDependencies).toStrictEqual(info.devDependencies);
  });
});
