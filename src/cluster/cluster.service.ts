import { Injectable, Inject } from '@nestjs/common';
import { ClusteredMessage, IClusteringAlgorithm, Message } from './cluster.interface';
import { Cluster } from './cluster.interface';

export interface IClusterService {
  generateClusters(messages: Message[]): ClusteredMessage[];
  getClusterNames(): string[];
  getMessages(): ClusteredMessage[] | null;
}

@Injectable()
export class ClusterService implements IClusterService {
  constructor(
    @Inject('IClusteringAlgorithm')
    private clusterAlgorithm: IClusteringAlgorithm,
  ) {}

  private messages: ClusteredMessage[] = [];
  private clusterNames: string[] = [];

  generateClusters(messages: Message[]) {
    const embeddings = messages.map((message) => message.embedding);

    this.clusterAlgorithm.generate(embeddings);

    //update messages with clusterId
    this.clusterAlgorithm.getCluster().forEach((embeddingIndices, clusterId) => {
      // embeddingIndices.forEach((index) => (messages[index] = clusterId));
      const messagesInCluster = embeddingIndices.map((index) => messages[index]);
      this.messages.push({ clusterId, messages: messagesInCluster });
    });

    //set outliers to a negative num
    const messagesInOutlier = this.clusterAlgorithm.getOutliers().map((index) => messages[index]);
    this.messages.push({ clusterId: -1, messages: messagesInOutlier });

    return this.messages;
  }

  getCentroids() {
    //group messages by clusterId
    //return the average of each cluster
  }

  getMessages() {
    return this.messages;
  }

  getClusterNames() {
    return this.clusterNames;
  }

  getScore() {}
}
