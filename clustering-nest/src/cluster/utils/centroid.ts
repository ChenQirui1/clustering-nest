import { euDistance } from './scoring';
import { ClusteredMessage, Message, Centroid } from '../cluster.interface';

export function centroids(clusters: ClusteredMessage[]): Centroid[] {
  //for each cluster,get each embedding, sum them up, divide by number of embeddings
  let centroids: Centroid[] = [];

  clusters.forEach((cluster) => {
    const embeddings = cluster.messages.map((message) => message.embedding);

    const mean = embeddings
      //sum up all points
      .reduce((sum, point) => sum.map((val, index) => val + point[index]), [])
      //divide by number of points
      .map((sum) => sum / cluster.messages.length);

    centroids.push({ clusterId: cluster.clusterId, embedding: mean });
  });
  return centroids;
}

//get the coordinate of the centroids
export function centroidsTest(clusteredPoints: number[][][]) {
  //for each cluster,get each embedding, sum them up, divide by number of embeddings
  // let centroids: number[][] = [];
  return clusteredPoints.map((clusteredPoint) =>
    clusteredPoint
      //sum up all points
      .reduce((sum, point) => sum.map((val, index) => val + point[index]), [])
      //divide by number of points
      .map((sum) => sum / clusteredPoint.length),
  );
}

export function distanceFromCentroids(centroids: number[][], point: number[]) {
  return centroids.map((centroid) => euDistance(point, centroid));
}
// function nearestPointToCentroid(centroid: Centroid, messageInCluster: ClusteredMessage) {
//   let nearestPoint = messageInCluster.messages[0];
//   let nearestDistance = euDistance(centroid.embedding, messageInCluster.messages[0].embedding);
//   for (let i = 1; i < centroid.embedding.length; i++) {
//     const point = messageInCluster.messages[i];
//     const distanceToCentroid = euDistance(centroid.embedding, point.embedding);
//     if (distanceToCentroid < nearestDistance) {
//       nearestDistance = distanceToCentroid;
//       nearestPoint = point;
//     }
//   }
//   return nearestPoint;
// }

// export function nearestPointsToCentroids(
//   centroids: Centroid[],
//   clusteredMessage: ClusteredMessage[],
// ) {
//   return centroids.map((centroid) => {
//     const messageInCluster = clusteredMessage.find(
//       (cluster) => cluster.clusterId === centroid.clusterId,
//     );
//     return nearestPointToCentroid(centroid, messageInCluster);
//   });

// }
