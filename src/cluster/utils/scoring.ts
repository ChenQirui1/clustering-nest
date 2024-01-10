import cluster from 'cluster';
import { Message, ClusteredMessage, Centroid } from '../cluster.interface';
import { centroids, distanceFromCentroids } from './centroid';

//formula for silhoutte coefficient
//https://scikit-learn.org/stable/modules/clustering.html#silhouette-coefficient
export function silhoutteCoeffPerPoint(a: number, b: number) {
  return (b - a) / Math.max(a, b);
}

export function silhoutteCoeff(clusteredMessage: ClusteredMessage[]) {
  // const sum = clusteredMessage
  //   .map((cluster) =>
  //     cluster.messages
  //       .map((message) => {
  //         const { a, b } = inOutDistancePerPoint(message, clusteredMessage);
  //         return silhoutteCoeffPerPoint(a, b);
  //       })
  //       .reduce((sum, currentCoeff) => sum + currentCoeff, 0),
  //   )
  //   .reduce((sum, currentCoeff) => sum + currentCoeff, 0);

  const messages = clusteredMessage.map((cluster) => cluster.messages).flat();

  const sum = messages
    .map((message) => {
      const { a, b } = inOutDistancePerPoint(message, clusteredMessage);
      return silhoutteCoeffPerPoint(a, b);
    })
    .reduce((sum, currentCoeff) => sum + currentCoeff, 0);

  return sum / messages.length;
}

//used to identify closest and second closest
export function closestCluster(centroids: Centroid[], point: Message) {
  const distances = distanceFromCentroids(centroids, point);
  //TODO: add a check for at least 2 clusters
  //find next nearest cluster
  let closestCluster = distances[0];
  let secondClosestCluster = distances[1];

  for (let i = 0; i < distances.length; i++) {
    if (distances[i].distance < closestCluster.distance) {
      closestCluster = distances[i];

      if (distances[i].distance < secondClosestCluster.distance) {
        secondClosestCluster = distances[i];
      }
    }
  }
  return [closestCluster.clusterId, secondClosestCluster.clusterId];
}
// calculate the mean distance of a point from other points
export function calculateDistanceAgainstPoints(pointEmbedding: number[], embeddings: number[][]) {
  const sum = embeddings
    .map((embedding) => euDistance(pointEmbedding, embedding))
    //sum up all points
    .reduce((sum, currentDistance) => sum + currentDistance, 0);

  return sum / embeddings.length;
}

export function euDistance(a: number[], b: number[]) {
  const distance = Math.hypot(...Object.keys(a).map((k) => b[k] - a[k]));
  return distance;
}

export function inOutDistancePerPoint(point: Message, clusteredMessage: ClusteredMessage[]) {
  //get centroids
  const centroidsFromCluster = centroids(clusteredMessage);

  //get closest clusters
  const twoClosestClusters = closestCluster(centroidsFromCluster, point);

  const embeddingA = clusteredMessage
    .find((cluster) => cluster.clusterId === twoClosestClusters[0])
    .messages.map((message) => message.embedding);

  const embeddingB = clusteredMessage
    .find((cluster) => cluster.clusterId === twoClosestClusters[1])
    .messages.map((message) => message.embedding);

  const distA = calculateDistanceAgainstPoints(point.embedding, embeddingA);

  const distB = calculateDistanceAgainstPoints(point.embedding, embeddingB);

  return { a: distA, b: distB };
}
