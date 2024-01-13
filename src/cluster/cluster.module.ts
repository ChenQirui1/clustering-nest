import { Module } from '@nestjs/common';
import { ClusterController } from './cluster.controller';
import { ClusterService } from './cluster.service';
import { Dbscan } from './utils/dbscan';
import { KMeans } from './utils/kmeans';

@Module({
  controllers: [ClusterController],
  providers: [
    {
      provide: 'IClusteringAlgorithm',
      useClass: KMeans,
    },
    ClusterService,
  ],
  exports: [ClusterService],
})
export class ClusterModule {}
