import { WebSocketService } from './websocket.service';
import { Package } from '../utils/package/package';
import { IPackageInfo } from 'src/utils/package/package.interface';

jest.mock('../utils/package/package');

describe('websocket/websocket.service', () => {
  let logs: { message: string; params?: any }[] = [];
  let _package: Package;
  let webSocketService: WebSocketService;
  const logger = {
    log: (message: string, params?: any): void => {
      logs.push({ message, params });
    },
  } as any;

  beforeEach(() => {
    _package = new Package();
    webSocketService = new WebSocketService(_package, logger);
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
      },
    };
    jest
      .spyOn(_package, 'getPackageInfo')
      .mockImplementation(() => packageInfo);
    expect(await webSocketService.getPackageInfo()).toStrictEqual(packageInfo);
    expect(logs[0].message).toBe('get version');
    expect(logs[0].params).toStrictEqual({
      name: 'package/1',
      version: '1.0.0-alpha',
    });
  });
});
