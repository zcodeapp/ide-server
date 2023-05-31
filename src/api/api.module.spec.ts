import { Test } from '@nestjs/testing';
import { ApiModule } from './api.module';
import { Package } from '../utils/package/package';
import { ApiService } from './api.service';
import { Logger } from '@nestjs/common';
import { ApiController } from './api.controller';

describe('api/api.module', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(ApiModule)).toBeInstanceOf(ApiModule);
  });
  it('should compile the api controller', async () => {
    const module = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    expect(module.get(ApiController)).toBeInstanceOf(ApiController);
  });
  it('should compile the package provider', async () => {
    const module = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    expect(module.get(Package)).toBeInstanceOf(Package);
  });
  it('should compile the api service provider', async () => {
    const module = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    expect(module.get(ApiService)).toBeInstanceOf(ApiService);
  });
  it('should compile the logger provider', async () => {
    const module = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    expect(module.get(Logger)).toBeInstanceOf(Logger);
  });
  it('should compile the getDate provider', async () => {
    const module = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    expect(module.get('getDate')()).toBeInstanceOf(Date);
  });
});
