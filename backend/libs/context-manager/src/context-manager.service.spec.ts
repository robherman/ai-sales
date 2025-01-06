import { Test, TestingModule } from '@nestjs/testing';
import { ContextManagerService } from './context-manager.service';

describe('ContextManagerService', () => {
  let service: ContextManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContextManagerService],
    }).compile();

    service = module.get<ContextManagerService>(ContextManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
