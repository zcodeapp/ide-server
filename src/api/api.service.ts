import { Injectable, Logger } from '@nestjs/common';
import { Package } from '../utils/package/package';
import { IPackageInfo } from '../utils/package/package.interface';

@Injectable()
export class ApiService {
  constructor(
    private readonly _package: Package,
    private readonly _logger: Logger,
  ) {}

  async getPackageInfo(): Promise<IPackageInfo> {
    const packageInfo = this._package.getPackageInfo();
    this._logger.log('get version', {
      name: packageInfo.name,
      version: packageInfo.version,
    });
    return packageInfo;
  }
}
