import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

jest.mock('./websocket/websocket.module');

describe('app.module', () => {
    it('should compile the module', async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      expect(module).toBeDefined();
      expect(module.get(AppModule)).toBeInstanceOf(AppModule);
    });
  });