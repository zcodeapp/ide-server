import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebSocketAdapter } from './adapters/websocket.adapter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(Logger);

  app.useWebSocketAdapter(new WebSocketAdapter(logger, app));
  app
    .listen(port)
    .then(() => {
      logger.log('Success on start application', {
        port,
      });
    })
    .catch((err) => {
      logger.error('Error on try start application', {
        port,
        error: err?.message,
        exception: err,
      });
    });
}
bootstrap();
