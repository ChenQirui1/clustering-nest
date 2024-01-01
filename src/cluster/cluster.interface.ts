export interface Cluster {
  embedding: number[];
  clusterId: number;
}

export interface Message {
  messageId: number;
  embedding: number[];
  clusterId: number | null;
}

export interface ClusterName {
  clusterId: number;
  clusterName: string;
}

export interface IClusteringAlgorithm {
  generate(messages: number[][]): void;
  getCluster(): Cluster[];
  getClusterNames(): string[];
}
