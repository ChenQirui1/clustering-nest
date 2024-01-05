//for each cluster,get each embedding, sum them up, divide by number of embeddings
interface ClusteredEmbedding {
  clusterId: number;
  embeddings: number[][];
}

import { ClusteredMessage } from '../cluster.interface';
interface Centroid {
  clusterId: number;
  embedding: number[];
}

export function centroids(clusters: ClusteredMessage[]): Centroid[] {
  return clusters.map((cluster) => {
    const sum = cluster.messages.reduce(
      (sum, messages) => {
        return sum.map((sum, index) => sum + messages[index].embedding);
      },
      [0, 0],
    );

    const mean = sum.map((sum) => sum / cluster.messages.length);

    return { clusterId: cluster.clusterId, embedding: mean };
  });
}

function nearestPointToCentroid(centroid: number[], embeddings: number[][]) {
  let nearestPoint = embeddings[0];
  let nearestDistance = euDistance(centroid, embeddings[0]);
  for (let i = 1; i < embeddings.length; i++) {
    const point = embeddings[i];
    const distanceToCentroid = euDistance(centroid, point);
    if (distanceToCentroid < nearestDistance) {
      nearestDistance = distanceToCentroid;
      nearestPoint = point;
    }
  }
  return nearestPoint;
}

export function nearestPointsToCentroids(
  centroids: number[][],
  clusteredEmbedding: ClusteredEmbedding[],
) {
  return centroids.map((centroid, index) => {
    return nearestPointToCentroid(centroid, clusteredEmbedding[index].embeddings);
  });
}
