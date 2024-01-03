import { Injectable } from '@nestjs/common';
import { Embedding } from './embed.interface';
import { OpenAIService } from '../openai/openai.service';
export interface EmbeddingService {
  generateEmbeddings(message: string): Promise<number[]>;
}

@Injectable()
export class TextAda implements EmbeddingService {
  private embeddedStrings: Embedding[] = [];

  constructor(private openaiService: OpenAIService) {}

  //TODO: fix the promise
  async generateEmbeddings(message: string) {
    const embedding: Promise<number[]> = await this.openaiService
      .getClient()
      .embeddings.create({
        model: 'text-embedding-ada-002',
        input: message,
        encoding_format: 'float',
      })
      .then((response) => {
        return response.data[0].embedding;
      })
      .catch((error) => {
        return error;
      });
    return embedding;
  }
}
