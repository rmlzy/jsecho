import { Test, TestingModule } from '@nestjs/testing';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';

describe('OptionsController', () => {
  let controller: OptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [OptionsService],
    }).compile();

    controller = module.get<OptionsController>(OptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
