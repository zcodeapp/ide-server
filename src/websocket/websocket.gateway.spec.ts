import { Test } from '@nestjs/testing';
import { WebSocketGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';
import { Package } from '../utils/package/package';
import { IPackageInfo } from 'src/utils/package/package.interface';

jest.mock('./websocket.service');
jest.mock('../utils/package/package');

describe('websocket/websocket.gateway', () => {

  let logs: { message: string, params?: any }[] = [];
  let webSocketGateway: WebSocketGateway;
  let webSocketService: WebSocketService;
  let _package: Package;
  const logger = {
    log: (message: string, params?: any): void => {
        logs.push({ message, params });
    }
  } as any;

  beforeEach(() => {
    _package = new Package();
    webSocketService = new WebSocketService(_package, logger);
    webSocketGateway = new WebSocketGateway(webSocketService);
  });

  afterEach(() => {
    logs = [];
  });

  it('method version success', async () => {
    const packageInfo: IPackageInfo = {
      name: 'package/1',
      version: '1.0.0-alpha',
      dependencies: {
        'package/2': '0.0.1',
      },
      devDependencies: {
        'package/3': '0.0.2',
      }
    };
    jest.spyOn(webSocketService, 'getPackageInfo').mockImplementation(async () => packageInfo)

    expect(await webSocketGateway.version()).toStrictEqual(packageInfo)
  });
});