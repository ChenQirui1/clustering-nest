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

  getMessages() {
    return this.messages;
  }

  getClusterNames() {
    return this.clusterNames;
  }
}
