import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class Authorizer {
  constructor(@Inject('SERVER_KEY') private _key: string) {}

  setKey(key: string): void {
    this._key = key;
  }

  async validateKey(key: string): Promise<boolean> {
    return key === this._key;
  }
}
