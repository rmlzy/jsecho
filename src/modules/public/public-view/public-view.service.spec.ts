import { Test, TestingModule } from '@nestjs/testing';
import { PublicViewService } from './public-view.service';

describe('PublicViewService', () => {
  let service: PublicViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicViewService],
    }).compile();

    service = module.get<PublicViewService>(PublicViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
