import { Test, TestingModule } from '@nestjs/testing';
import { ClusterService } from './cluster.service';
import { Message } from './cluster.interface';
import { Dbscan } from './utils/dbscan';
import benefits from '../data/benefits_transformed.json';
import { PCA } from 'ml-pca';

describe('ClusterService', () => {
  let service: ClusterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClusterService, { provide: 'IClusteringAlgorithm', useClass: Dbscan }],
    }).compile();

    service = module.get<ClusterService>(ClusterService);
  });

  describe('generateClusters', () => {
    it('should create clusters', () => {
      const embedding = [
        [1, 1],
        [0, 1],
        [1, 0],
        [10, 10],
        [10, 13],
        [13, 13],
        [54, 54],
        [55, 55],
        [89, 89],
        [57, 55],
      ];
      const result = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 9],
      ];
      const noise = [8];

      const mockMessages: Message[] = embedding.map((embedding, index) => ({
        messageId: index,
        embedding,
      }));

      service.generateClusters(mockMessages);

      // console.log(service.getMessages());
      service.getScore();
      // Assert
      // expect(service.getMessages()).toBeInstanceOf();
      expect(Array.isArray(service.getMessages())).toBe(true);
    });
  });
});

describe('test mock data', () => {
  let service: ClusterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClusterService, { provide: 'IClusteringAlgorithm', useClass: Dbscan }],
    }).compile();

    service = module.get<ClusterService>(ClusterService);
  });

  describe('test data', () => {
    it('should cluster test data', () => {
      const mockMessages: Message[] = benefits
        .filter((benefit) => benefit.embeddings && benefit.embeddings.length > 0)
        .map((benefit) => ({ messageId: benefit.id, embedding: benefit.embeddings }));

      service.generateClusters(mockMessages);

      console.log(service.getMessages());
      console.log(service.getCentroids());
      console.log(service.getScore());

      expect(Array.isArray(service.getMessages())).toBe(true);
    });
  });
});
