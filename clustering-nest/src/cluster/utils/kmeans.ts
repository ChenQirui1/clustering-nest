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
  private nClusters: number;
  private score: number;

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
    let clusterCount = [];
    let clusterScore = 0;
    for (let i = 2; i < 6; i++) {
      const clustersOfIndex = kmeans.run(embeddings, i);

      const clusteredEmbeddings = clustersOfIndex.map((cluster) =>
        cluster.map((index) => embeddings[index]),
      );

      // const pass = testRun(clusteredEmbeddings, 0.5);
      // if (pass) {
      //   //if pass, stop
      //   clusterCount.push(i);
      // }
      //
      const score = silhouetteCoeff(clusteredEmbeddings);
      if (clusterScore < score) {
        clusterScore = score;
        clusterCount = [i];
      }
    }

    this.nClusters = clusterCount[0];
    this.score = clusterScore;

    console.log('nClusters: ', this.nClusters);
    console.log('score: ', this.score);
  }
  generate(embeddings: number[][]) {
    const kmeans = new KMEANS();
    console.log('nClusters: ', this.nClusters);
    return kmeans.run(embeddings, this.nClusters);
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
