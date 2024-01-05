import { Injectable, Inject } from '@nestjs/common';
import { IClusteringAlgorithm, Message } from './cluster.interface';
import { Cluster } from './cluster.interface';

export interface IClusterService {
  generateClusters(messages: Message[]): Cluster[];
  getClusterNames(): string[];
  getMessages(): Message[] | null;
}

@Injectable()
export class ClusterService implements IClusterService {
  constructor(
    @Inject('IClusteringAlgorithm')
    private clusterAlgorithm: IClusteringAlgorithm,
  ) {}

  private messages: Message[] = [];
  private clusterNames: string[] = [];

  generateClusters(messages: Message[]) {
    const embeddings = messages.map((message) => message.embedding);

    this.clusterAlgorithm.generate(embeddings);

    //update messages with clusterId
    this.clusterAlgorithm.getCluster().forEach((embeddingIndices, clusterId) => {
      embeddingIndices.forEach((index) => (messages[index].clusterId = clusterId));
    });

    //set outliers to a negative num
    this.clusterAlgorithm.getOutliers().forEach((messageIndex) => {
      messages[messageIndex].clusterId = -1;
    });

    this.messages = messages;

    return this.messages;
  }

  getCentroids() {
    //group messages by clusterId
    //return the average of each cluster
    const clusters = this.messages.reduce((clusters, message) => {
      if (message.clusterId === null) {
        return clusters;
      }
      if (!clusters[message.clusterId]) {
        clusters[message.clusterId] = [];
      }
      clusters[message.clusterId].push(message.embedding);
      return clusters;
    }, {});

    //for each cluster,get each embedding, sum them up, divide by number of embeddings
    const centroids = Object.values(clusters).map((cluster: number[][]) => {
      const sum = cluster.reduce(
        (sum, embedding) => {
          return sum.map((sum, index) => sum + embedding[index]);
        },
        [0, 0],
      );
      return sum.map((sum) => sum / cluster.length);
    });
    return centroids;
  }

  getMessages() {
    return this.messages;
  }

  getClusterNames() {
    return this.clusterNames;
  }

  getScore() {}
}
