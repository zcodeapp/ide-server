import { Test } from '@nestjs/testing';
import { WebSocketModule } from './websocket.module';

jest.mock('./websocket.module');

describe('websocket/websocket.module', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [WebSocketModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(WebSocketModule)).toBeInstanceOf(WebSocketModule);
  });
});
