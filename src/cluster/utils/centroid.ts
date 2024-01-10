import { euDistance } from './scoring';
import { ClusteredMessage, Message, Centroid } from '../cluster.interface';

export function centroids(clusters: ClusteredMessage[]): Centroid[] {
  //for each cluster,get each embedding, sum them up, divide by number of embeddings
  let centroids: Centroid[] = [];

  clusters.forEach((cluster) => {
    const embeddings = cluster.messages.map((message) => message.embedding);

    const mean = embeddings
      //sum up all points
      .reduce((sum, point) => sum.map((val, index) => val + point[index]))
      //divide by number of points
      .map((sum) => sum / cluster.messages.length);

    centroids.push({ clusterId: cluster.clusterId, embedding: mean });
  });
  return centroids;
}

function nearestPointToCentroid(centroid: Centroid, messageInCluster: ClusteredMessage) {
  let nearestPoint = messageInCluster.messages[0];
  let nearestDistance = euDistance(centroid.embedding, messageInCluster.messages[0].embedding);
  for (let i = 1; i < centroid.embedding.length; i++) {
    const point = messageInCluster.messages[i];
    const distanceToCentroid = euDistance(centroid.embedding, point.embedding);
    if (distanceToCentroid < nearestDistance) {
      nearestDistance = distanceToCentroid;
      nearestPoint = point;
    }
  }
  return nearestPoint;
}

export function nearestPointsToCentroids(
  centroids: Centroid[],
  clusteredMessage: ClusteredMessage[],
) {
  return centroids.map((centroid) => {
    const messageInCluster = clusteredMessage.find(
      (cluster) => cluster.clusterId === centroid.clusterId,
    );
    return nearestPointToCentroid(centroid, messageInCluster);
  });
}

export function distanceFromCentroids(centroids: Centroid[], point: Message) {
  return centroids.map((centroid) => ({
    clusterId: centroid.clusterId,
    distance: euDistance(point.embedding, centroid.embedding),
  }));
}

export function closestCluster(centroids: Centroid[], point: Message) {
  const distances = distanceFromCentroids(centroids, point);

  //find next nearest cluster
  let closestCluster = distances[0];
  let secondClosestCluster = distances[1];

  for (let i = 0; i < distances.length; i++) {
    if (distances[i].distance < closestCluster.distance) {
      closestCluster = distances[i];
    } else if (distances[i].distance < secondClosestCluster.distance) {
      secondClosestCluster = distances[i];
    }
  }
  return [closestCluster.clusterId, secondClosestCluster.clusterId];
}
