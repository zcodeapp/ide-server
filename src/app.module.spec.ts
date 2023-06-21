import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ThrottlerModule } from '@nestjs/throttler';

jest.mock('./plugins/websocket/websocket.module');

describe('app.module', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ThrottlerModule, AppModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(AppModule)).toBeInstanceOf(AppModule);
  });
});
