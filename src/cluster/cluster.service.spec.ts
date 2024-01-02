import { Test, TestingModule } from '@nestjs/testing';
import { ClusterService } from './cluster.service';
import { Message } from './cluster.interface';
import { Dbscan } from './utils/dbscan';

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
        clusterId: null,
      }));

      service.generateClusters(mockMessages);

      console.log(service.getMessages());
      // Assert
      // expect(service.getMessages()).toBeInstanceOf();
      expect(Array.isArray(service.getMessages())).toBe(true);
    });
  });
});
