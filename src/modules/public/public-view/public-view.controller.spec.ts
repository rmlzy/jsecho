import { Test, TestingModule } from '@nestjs/testing';
import { PublicViewController } from './public-view.controller';

describe('PublicViewController', () => {
  let controller: PublicViewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicViewController],
    }).compile();

    controller = module.get<PublicViewController>(PublicViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
