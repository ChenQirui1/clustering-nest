import { Injectable } from '@nestjs/common';
import { Cluster } from 'cluster';
import { IClusteringAlgorithm } from './cluster.interface';

export interface IClusterService {
  generateClusters(messages: string[]): Cluster[];
  getClusterNames(): string[];
}

@Injectable()
export class ClusterService implements IClusterService {
  constructor(private clusterAlgorithm: IClusteringAlgorithm) {}

  private clusters: Cluster[] = [];
  private clusterNames: string[] = [];

  generateClusters(messages: string[]) {
    this.clusterAlgorithm.generate(messages);

    //save the result to the private prop
    const clusters = this.clusterAlgorithm.clusters.map((embeddingIndices, clusterId) => {
      const embedding = embeddingIndices.map((index) => {
        // Assuming you have an array of embeddings named 'inputEmbeddings'
        return { embedding: messages[index], clusterId };
      });

      return embedding;
    });
  }

  getClusterNames() {
    return this.clusterNames;
  }
}
