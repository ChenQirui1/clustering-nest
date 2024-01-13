export interface Cluster {
  embedding: number[];
  clusterId: number;
}

export interface ClusteredMessage {
  clusterId: number;
  messages: Message[];
}

export interface Message {
  messageId: number;
  embedding: number[];
}

export interface Centroid {
  clusterId: number;
  embedding: number[];
}

export interface ClusterName {
  clusterId: number;
  clusterName: string;
}

export interface IClusteringAlgorithm {
  generate(messages: number[][]): number[][];
  fit(embeddings: number[][]): void;
  getCluster(): number[][];
  getClusterNames(): string[];
  getOutliers(): number[];
}
