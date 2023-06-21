import { Authorizer } from './authorizer';

describe('plugins/authorizer', () => {
  const key = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  let instance: Authorizer;

  beforeEach(() => {
    instance = new Authorizer(key);
  });

  it('test authorizer construct and compare constructor key', async () => {
    expect(await instance.validateKey(key)).toBeTruthy();
  });

  it('test set new key', async () => {
    const newKey = 'new-key';
    instance.setKey(newKey);
    expect(await instance.validateKey(key)).toBeFalsy();
    expect(await instance.validateKey(newKey)).toBeTruthy();
  });

  it('test case sensitive key', async () => {
    const newKey = 'new-key';
    const newKeySensitive = 'New-Key';
    instance.setKey(newKey);
    expect(await instance.validateKey(newKeySensitive)).toBeFalsy();
  });
});
