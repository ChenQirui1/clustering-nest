import { IClusteringAlgorithm } from '../../cluster/cluster.interface';
import { Cluster } from '../../cluster/cluster.interface';
import { Injectable } from '@nestjs/common';
import { DBSCAN } from 'density-clustering';

@Injectable()
export class Dbscan implements IClusteringAlgorithm {
  private clusters: number[][];
  private clusterNames: string[];
  private outliers: number[] = [];

  generate(embeddings: number[][]) {
    //dbscan implementation from
    //https://github.com/uhho/density-clustering
    const dbscan = new DBSCAN();

    //TODO: make these parameters configurable, add constants
    const clustersOfIndex = dbscan.run(embeddings, 11, 5);

    this.clusters = clustersOfIndex;
    this.outliers = dbscan.noise;
  }
  getCluster() {
    return this.clusters;
  }
  getClusterNames() {
    return this.clusterNames;
  }
  getOutliers() {
    return this.outliers;
  }
}
