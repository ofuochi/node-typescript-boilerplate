import { Test, TestingModule } from '@nestjs/testing';
import { TravelPackageService } from './travel-package.service';

describe('TravelPackageService', () => {
  let service: TravelPackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelPackageService],
    }).compile();

    service = module.get<TravelPackageService>(TravelPackageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
