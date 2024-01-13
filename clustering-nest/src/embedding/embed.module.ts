import { Module } from '@nestjs/common';
import { TextAda } from './embed.service';
import { OpenAIService } from 'src/openai/openai.service';

@Module({
  imports: [OpenAIService],
  providers: [
    {
      provide: 'EmbeddingService',
      useClass: TextAda,
    },
  ],
})
export class EmbeddingModule {}
