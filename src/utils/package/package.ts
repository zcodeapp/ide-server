import { Injectable } from '@nestjs/common';
import { IPackageInfo } from './package.interface';
import * as fs from 'fs';

@Injectable()
export class Package {

  getPackageInfo(): IPackageInfo {
    const file = fs.readFileSync('package.json').toString();
    const info = JSON.parse(file);
    return {
      name: info.name,
      version: info.version,
      dependencies: info.dependencies,
      devDependencies: info.devDependencies,
    };
  }
}
