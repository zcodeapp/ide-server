import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { BaseWsInstance, MessageMappingProperties } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server, ServerOptions, Socket } from 'socket.io';

export class WebSocketAdapter extends IoAdapter {
  constructor(
    private readonly _logger: Logger,
    readonly appOrHttpServer?: INestApplicationContext,
  ) {
    super(appOrHttpServer);
  }

  public async close(server: BaseWsInstance): Promise<void> {
    this._logger.log('Bind close');
    super.close(server);
  }

  public async dispose(): Promise<void> {
    this._logger.log('Bind dispose');
    super.dispose();
  }

  public bindMessageHandlers(
    socket: Socket,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ): void {
    this._logger.log('Bind bindMessageHandlers');
    super.bindMessageHandlers(socket, handlers, transform);
  }

  public createIOServer(port: number, options?: any): any {
    this._logger.log('Bind createIOServer', {
      port,
      options,
    });
    return super.createIOServer(port, options);
  }

  public create(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ): Server {
    this._logger.log('Bind create', {
      port,
      options,
    });
    return super.create(port, options);
  }

  public bindClientConnect(server: Server, callback: () => void): void {
    this._logger.log('Bind bindClientConnect');
    super.bindClientConnect(server, callback);
  }

  public bindClientDisconnect(client: Socket, callback: () => void): void {
    this._logger.log('Bind bindClientDisconnect');
    super.bindClientDisconnect(client, callback);
  }
}
