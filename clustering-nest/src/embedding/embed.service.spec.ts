import { TextAda } from './embed.service';
import { EmbeddingService } from './embed.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIModule } from '../openai/openai.module';

describe('Embed', () => {
  let service: EmbeddingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OpenAIModule],
      providers: [
        {
          provide: 'EmbeddingService',
          useClass: TextAda,
        },
      ],
    }).compile();

    service = module.get<EmbeddingService>('EmbeddingService');
  });

  describe('generateEmbedding', () => {
    it('should return embedding of the test string', async () => {
      const message = 'hello world';

      const embedding = await service.generateEmbeddings(message);

      console.log(embedding);
    });
  });
});
