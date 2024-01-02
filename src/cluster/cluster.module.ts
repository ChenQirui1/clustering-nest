import { Module } from '@nestjs/common';
import { ClusterController } from './cluster.controller';
import { ClusterService } from './cluster.service';
import { Dbscan } from './utils/dbscan';

@Module({
  controllers: [ClusterController],
  providers: [
    {
      provide: 'IClusteringAlgorithm',
      useClass: Dbscan,
    },
    ClusterService,
  ],
})
export class ClusterModule {}
