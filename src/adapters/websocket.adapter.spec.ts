import { WebSocketAdapter } from './websocket.adapter';
import { Server, Socket } from 'socket.io';

jest.mock('socket.io');

describe('adapters/websocket.adapter', () => {
  
  let webSocketAdapter: WebSocketAdapter;
  let logs: { message: string, params?: any }[];
  
  const logger = {
      log: (message: string, params?: any): void => {
          logs.push({ message, params });
      }
  } as any;

  beforeEach(async () => {
    webSocketAdapter = new WebSocketAdapter(logger);
  });

  afterEach(() => {
    logs = [];
  });

  it('test success mount instance', () => {
    expect(webSocketAdapter).toBeInstanceOf(WebSocketAdapter);
  });

  it('test create with port', () => {
    const server = webSocketAdapter.create(80);
    server.close();
    if (logs.length == 0) {
        throw new Error('Error on try get create with port logs for tests');
    }
    expect(logs[0].message).toBe('Bind create');
    expect(logs[0].params).toStrictEqual({port: 80, options: undefined});
    expect(logs[1].message).toBe('Bind createIOServer');
    expect(logs[1].params).toStrictEqual({port: 80, options: undefined});
  });

  it('test create with port and options', () => {
    const server = webSocketAdapter.create(80, {
        cors: {
            origin: '*'
        }
    } as any);
    server.close();
    if (logs.length == 0) {
        throw new Error('Error on try get create with port and options logs for tests');
    }
    expect(logs[0].message).toBe('Bind create');
    expect(logs[0].params).toStrictEqual({port: 80, options: { cors: { origin: '*' }}});
    expect(logs[1].message).toBe('Bind createIOServer');
    expect(logs[1].params).toStrictEqual({port: 80, options: { cors: { origin: '*' } }});
  });

  it('test success close', () => {
    const server = webSocketAdapter.create(80);
    webSocketAdapter.close(server);
    if (logs.length == 0) {
      throw new Error('Error on try get logs close for tests');
    }
    expect(logs[0].message).toBe('Bind create');
    expect(logs[0].params).toStrictEqual({port: 80, options: undefined});
    expect(logs[1].message).toBe('Bind createIOServer');
    expect(logs[1].params).toStrictEqual({port: 80, options: undefined});
    expect(logs[2].message).toBe('Bind close');
  });

  it('test success dispose', () => {
    webSocketAdapter.dispose();
    if (logs.length == 0) {
      throw new Error('Error on try get logs dispose for tests');
    }
    expect(logs[0].message).toBe('Bind dispose');
  });

  it ('test success bindMessageHandlers', () => {
    const socket = new Socket(null, null, null, null);
    webSocketAdapter.bindMessageHandlers(socket, [], () => null)
    expect(logs[0].message).toBe('Bind bindMessageHandlers');
  });

  it ('test success bindClientConnect', () => {
    const server = new Server();
    webSocketAdapter.bindClientConnect(server, () => null)
    expect(logs[0].message).toBe('Bind bindClientConnect');
  });

  it ('test success bindClientDisconnect', () => {
    const socket = new Socket(null, null, null, null);
    webSocketAdapter.bindClientDisconnect(socket, () => null)
    expect(logs[0].message).toBe('Bind bindClientDisconnect');
  });
});
