import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIService } from './openai.service';
import { ConfigModule } from '@nestjs/config';

describe('OpenAIService', () => {
  let service: OpenAIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [OpenAIService],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
  });

  describe('retrieve client', () => {
    it('should return client', () => {
      const client = service.getClient();
      expect(client).toBeDefined();
    });
  });
});
