import { Inject, Injectable } from '@nestjs/common';
import { Embedding } from './embed.interface';
import { OpenAIService } from '../openai/openai.service';

export interface EmbeddingService {
  generateEmbeddings(message: string): Promise<number[] | string>;
}

@Injectable()
export class TextAda implements EmbeddingService {
  constructor(private openaiService: OpenAIService) {}

  async generateEmbeddings(message: string) {
    return await this.openaiService
      .getClient()
      .embeddings.create({
        model: 'text-embedding-ada-002',
        input: message,
        encoding_format: 'float',
      })
      .then((response) => {
        // console.log(response.data[0].embedding);
        return response.data[0].embedding;
      })
      .catch((err) => {
        return 'failed to generate embedding';
      });
  }
}
