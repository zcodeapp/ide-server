import { WebSocketGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';
import { Package } from '../../utils/package/package';
import { IPackageInfo } from '../../utils/package/package.interface';
import { Authorizer } from '../authorizer/authorizer';

jest.mock('./websocket.service');
jest.mock('../../utils/package/package');
jest.mock('../authorizer/authorizer');

describe('websocket/websocket.gateway', () => {
  let logs: { message: string; params?: any }[] = [];
  let webSocketGateway: WebSocketGateway;
  let webSocketService: WebSocketService;
  let _package: Package;
  const serverKey = 'server-key';
  const authorizer: Authorizer = new Authorizer(serverKey);
  const logger = {
    log: (message: string, params?: any): void => {
      logs.push({ message, params });
    },
  } as any;

  beforeEach(() => {
    _package = new Package();
    webSocketService = new WebSocketService(_package, logger);
    webSocketGateway = new WebSocketGateway(webSocketService, authorizer);
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
      .spyOn(webSocketService, 'getPackageInfo')
      .mockImplementation(async () => packageInfo);

    expect(await webSocketGateway.handleVersion()).toStrictEqual(packageInfo);
  });

  it('test handle connection success', async () => {
    const result = {
      connected: false,
    };

    const client = {
      handshake: {
        auth: {
          key: serverKey,
        },
      },
      emit: (event: string) => {
        if (event == 'connected') result.connected = true;
      },
      disconnect: () => {
        console.log('disconnect');
      },
    } as any;

    jest.spyOn(authorizer, 'validateKey').mockImplementation(async () => true);

    await webSocketGateway.handleConnection(client);

    expect(result.connected).toBeTruthy();
  });

  it('test handle connection fail by server key error', async () => {
    const result = {
      message: '',
      disconnect: false,
    };

    const client = {
      handshake: {
        auth: {
          key: serverKey,
        },
      },
      emit: (event: string, params?: any) => {
        params = JSON.parse(params);
        if (event == 'system_error') result.message = params.message;
      },
      disconnect: () => {
        result.disconnect = true;
      },
    } as any;

    jest.spyOn(authorizer, 'validateKey').mockImplementation(async () => false);

    await webSocketGateway.handleConnection(client);

    expect(result.message).toBe('server_key_not_valid');
    expect(result.disconnect).toBeTruthy();
  });

  it('test handle connection fail by key undefined', async () => {
    const result = {
      message: '',
      disconnect: false,
    };

    const client = {
      handshake: {},
      emit: (event: string, params?: any) => {
        params = JSON.parse(params);
        if (event == 'system_error') result.message = params.message;
      },
      disconnect: () => {
        result.disconnect = true;
      },
    } as any;

    jest.spyOn(authorizer, 'validateKey').mockImplementation(async () => true);

    await webSocketGateway.handleConnection(client);

    expect(result.message).toBe('server_key_not_valid');
    expect(result.disconnect).toBeTruthy();
  });

  it('test handle connection fail by key empty', async () => {
    const result = {
      message: '',
    };

    const client = {
      handshake: {
        auth: {
          key: '',
        },
      },
      emit: (event: string, params?: any) => {
        params = JSON.parse(params);
        if (event == 'system_error') result.message = params.message;
      },
      disconnect: () => {
        console.log('disconnect');
      },
    } as any;

    jest.spyOn(authorizer, 'validateKey').mockImplementation(async () => true);

    await webSocketGateway.handleConnection(client);

    expect(result.message).toBe('server_key_not_valid');
  });
});
