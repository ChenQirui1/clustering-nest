import { IClusteringAlgorithm } from '../cluster.interface';
import { Cluster } from '../cluster.interface';
import { Injectable } from '@nestjs/common';
import { KMEANS } from 'density-clustering';
import { silhouetteCoeff, testRun } from './silhouette';

@Injectable()
export class KMeans implements IClusteringAlgorithm {
  private clusters: number[][];
  private clusterNames: string[];
  private outliers: number[] = [];

  fit(embeddings: number[][]) {
    //dbscan implementation from
    //https://github.com/uhho/density-clustering
    const kmeans = new KMEANS();

    //TODO: make these parameters configurable, add constants

    //using silhouette analysis to determine the best k
    //https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html
    //hyperparams -> clusterSize offset cutoff,
    //two test -> test if cluster exceeds average silhouette score
    //if cluster size distribution is within cutoff
    //choose one of the size from the remaining ones

    for (let i = 0; i < 10; i++) {
      const clustersOfIndex = kmeans.run(embeddings, 2);

      const clusteredEmbeddings = clustersOfIndex.map((cluster) =>
        cluster.map((index) => embeddings[index]),
      );

      const overallScore = silhouetteCoeff(clusteredEmbeddings);

      if (testRun(clusteredEmbeddings, overallScore, 0.1)) {
        //if pass, stop
        break;
      }
    }
    this.clusters = clustersOfIndex;
  }
  generate(embeddings: number[][]) {}
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
