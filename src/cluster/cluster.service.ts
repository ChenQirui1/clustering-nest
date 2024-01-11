import { Injectable, Inject } from '@nestjs/common';
import {
  Centroid,
  ClusterName,
  ClusteredMessage,
  IClusteringAlgorithm,
  Message,
} from './cluster.interface';
import { PCA } from 'ml-pca';
import { centroids } from './utils/centroid';
import { silhouetteCoeff } from './utils/scoring';

export interface IClusterService {
  generateClusters(messages: Message[]): ClusteredMessage[];
  getClusterNames(): ClusterName[];
  getMessages(): ClusteredMessage[];
  getScore(): number;
  getCentroids(): Centroid[];
}

@Injectable()
export class ClusterService implements IClusterService {
  constructor(
    @Inject('IClusteringAlgorithm')
    private clusterAlgorithm: IClusteringAlgorithm,
  ) {}

  private messages: ClusteredMessage[] = [];
  private clusterNames: ClusterName[] = [];
  private centroids: Centroid[] = [];

  generateClusters(messages: Message[]) {
    const embeddings = messages.map((message) => message.embedding);

    const pca = new PCA(embeddings);

    const newEmbeddings = pca.predict(embeddings).to2DArray();

    const reducedEmbeddings = newEmbeddings.map((newEmbedding) => newEmbedding.slice(0, 2));

    console.log('newEmbeddings: ', reducedEmbeddings);

    //perform clustering and determining cluster based on silhoutte analysis
    this.clusterAlgorithm.generate(reducedEmbeddings);

    console.log(this.clusterAlgorithm.getCluster());
    //update messages with clusterId
    this.clusterAlgorithm.getCluster().forEach((embeddingIndices, clusterId) => {
      // embeddingIndices.forEach((index) => (messages[index] = clusterId));
      const messagesInCluster = embeddingIndices.map((index) => messages[index]);
      this.messages.push({ clusterId, messages: messagesInCluster });
    });

    //set outliers to a negative num
    const messagesInOutlier = this.clusterAlgorithm.getOutliers().map((index) => messages[index]);
    this.messages.push({ clusterId: -1, messages: messagesInOutlier });

    this.centroids = centroids(this.messages);

    return this.messages;
  }

  getCentroids() {
    if (this.centroids.length === 0) {
      throw new Error('Centroids not generated');
    }
    return this.centroids;
  }

  getMessages() {
    if (this.messages.length === 0) {
      throw new Error('Messages not generated');
    }
    return this.messages;
  }

  getClusterNames() {
    if (this.clusterNames.length === 0) {
      throw new Error('Cluster names not generated');
    }
    return this.clusterNames;
  }

  getScore() {
    return silhouetteCoeff(this.messages);
  }
}
