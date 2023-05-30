import { Test } from '@nestjs/testing';
import { WebSocketModule } from './websocket.module';
import { Package } from '../utils/package/package';
import { WebSocketService } from './websocket.service';
import { WebSocketGateway } from './websocket.gateway';
import { Logger } from '@nestjs/common';

describe('websocket/websocket.module', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [WebSocketModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(WebSocketModule)).toBeInstanceOf(WebSocketModule);
  });
  it('should compile the package provider', async () => {
    const module = await Test.createTestingModule({
      imports: [WebSocketModule],
    })
    .compile();

    expect(module.get(Package)).toBeInstanceOf(Package);
  });
  it('should compile the websocket service provider', async () => {
    const module = await Test.createTestingModule({
      imports: [WebSocketModule],
    })
    .compile();

    expect(module.get(WebSocketService)).toBeInstanceOf(WebSocketService);
  });
  it('should compile the websocket gateway provider', async () => {
    const module = await Test.createTestingModule({
      imports: [WebSocketModule],
    })
    .compile();

    expect(module.get(WebSocketGateway)).toBeInstanceOf(WebSocketGateway);
  });
  it('should compile the logger provider', async () => {
    const module = await Test.createTestingModule({
      imports: [WebSocketModule],
    })
    .compile();

    expect(module.get(Logger)).toBeInstanceOf(Logger);
  });
});
