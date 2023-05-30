import { IPackageInfo } from 'src/utils/package/package.interface';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

const _date = new Date();
const _packageInfo: IPackageInfo = {
  name: 'package/1',
  version: '1.0.0-alpha',
  dependencies: {},
  devDependencies: {},
};

describe('api/api.controller', () => {
  let apiService: ApiService;
  let apiController: ApiController;

  beforeEach(() => {
    apiService = new ApiService({} as any, {} as any);
    apiController = new ApiController(apiService, () => _date);
  });

  it('test state', async () => {
    jest
      .spyOn(apiService, 'getPackageInfo')
      .mockImplementation(async () => _packageInfo);

    const state = await apiController.getState();
    expect(state.running).toBeTruthy();
    expect(state.version).toBe('1.0.0-alpha');
    expect(state.date).toBe(_date);
  });
});
