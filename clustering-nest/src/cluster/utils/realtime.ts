import { IClusteringAlgorithm } from '../cluster.interface';
import { Cluster } from '../cluster.interface';
import { Injectable } from '@nestjs/common';
import { KMEANS } from 'density-clustering';
import { silhouetteCoeff, testRun } from './silhouette';
import { euDistance } from './scoring';
import { centroidsTest } from './centroid';

@Injectable()
export class RealTimeCluster implements IClusteringAlgorithm {
  private clusters: number[][];
  private centroids: number[][];
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
  predict(embedding: number[]) {
    let distances: number[] = [];
    if (this.centroids.length) {
      for (let i = 0; i < this.centroids.length; i++) {
        const distance = euDistance(embedding, this.centroids[i]);
        distances.push(distance);
      }

      const indexOfClosestCluster = argmin(distances);

      if (distances[indexOfClosestCluster] > 0.5) {
        //new cluster
        this.centroids.push(embedding);
        return this.centroids.length - 1;
      } else {
        //existing cluster
        // add to existing points in cluster
        // retrieve cluster data
        // inject relevant data of the centroid
        let data: number[][] = [];
        data.push(embedding);
        const newCentroid = data
          .reduce(
            (sum, point) => sum.map((val, index) => val + point[index]),
            [],
          )
          .map((sum) => sum / data.length);

        this.centroids[indexOfClosestCluster] = newCentroid;
        return indexOfClosestCluster;
      }
    } else {
      //initial cluster
      this.centroids.push(embedding);
      return this.centroids.length - 1;
    }
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
