import { IPackageInfo } from '../utils/package/package.interface';
import { Package } from '../utils/package/package';
import { ApiService } from './api.service';

jest.mock('../utils/package/package');

describe('api/api.service', () => {
  let logs: { message: string; params?: any }[] = [];
  let _package: Package;
  let apiService: ApiService;

  const _logger = {
    log: (message: string, params?: any): void => {
      logs.push({ message, params });
    },
  } as any;

  beforeEach(() => {
    _package = new Package();
    apiService = new ApiService(_package, _logger);
  });

  afterEach(() => {
    logs = [];
  });

  it('test get version', async () => {
    const _packageInfo: IPackageInfo = {
      name: 'package/1',
      version: '1.0.0-alpha',
      dependencies: {
        'package/2': '0.0.1',
      },
      devDependencies: {
        'package/3': '0.0.2',
      },
    };
    jest
      .spyOn(_package, 'getPackageInfo')
      .mockImplementation(() => _packageInfo);

    const packageInfo = await apiService.getPackageInfo();
    expect(packageInfo).toBe(_packageInfo);
  });

  it('test logs', async () => {
    const _packageInfo: IPackageInfo = {
      name: 'package/1',
      version: '1.0.0-alpha',
      dependencies: {},
      devDependencies: {},
    };
    jest
      .spyOn(_package, 'getPackageInfo')
      .mockImplementation(() => _packageInfo);
    await apiService.getPackageInfo();
    expect(logs[0].params.name).toBe('package/1');
    expect(logs[0].params.version).toBe('1.0.0-alpha');
  });
});
