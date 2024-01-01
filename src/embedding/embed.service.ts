import { Injectable } from '@nestjs/common';
import { Embedding } from './embed.interface';

@Injectable()
export class EmbeddingService {
  private embeddedStrings: Embedding[] = [];

  generateEmbeddings(messages: string[]) {
    return this.embeddedStrings;
  }

  getEmbeddings() {
    return this.embeddedStrings;
  }
}
