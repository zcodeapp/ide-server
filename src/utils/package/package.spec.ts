import { Package } from './package';
import * as fs from 'fs';

describe('utils/package/package', () => {
  let packageInstance: Package;

  beforeEach(async () => {
    packageInstance = new Package();
  });

  it('test success get version from package.json', () => {
    const file = fs.readFileSync('package.json').toString();
    const info = JSON.parse(file);
    const _packageInfo = packageInstance.getPackageInfo();
    expect(info.name).toBe(_packageInfo.name);
    expect(info.version).toBe(_packageInfo.version);
    expect(info.dependencies).toStrictEqual(_packageInfo.dependencies);
    expect(info.devDependencies).toStrictEqual(_packageInfo.devDependencies);
  });
});
