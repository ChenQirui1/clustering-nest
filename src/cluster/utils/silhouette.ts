import cluster from 'cluster';
import { Message, ClusteredMessage, Centroid } from '../cluster.interface';
import { centroids, centroidsTest, distanceFromCentroids } from './centroid';

//formula for silhoutte coefficient
//https://scikit-learn.org/stable/modules/clustering.html#silhouette-coefficient
export function silhouetteCoeffPerPoint(a: number, b: number) {
  return (b - a) / Math.max(a, b);
}

export function silhouetteCoeff(clusteredPoints: number[][][]) {
  //original points
  const messages = clusteredPoints.flat();

  const sum = messages
    .map((message) => {
      const { a, b } = inOutDistancePerPoint(message, clusteredPoints);
      return silhouetteCoeffPerPoint(a, b);
    })
    .reduce((sum, currentCoeff) => sum + currentCoeff, 0);

  return sum / messages.length;
}

export function testCluster(clusteredPoints: number[][][], overallScore: number) {
  let acceptableCluster = [];
  for (let i = 0; i < clusteredPoints.length; i++) {
    let passFlag = false;
    for (let j = 0; j < clusteredPoints[i].length; j++) {
      const { a, b } = inOutDistancePerPoint(clusteredPoints[i][j], clusteredPoints);
      const score = silhouetteCoeffPerPoint(a, b);
      if (score > overallScore) {
        passFlag = true;
        break;
      }
    }

    if (!passFlag) {
    }
  }

  const sum = messages
    .map((message) => {
      const { a, b } = inOutDistancePerPoint(message, clusteredPoints);
      return silhouetteCoeffPerPoint(a, b);
    })
    .reduce((sum, currentCoeff) => sum + currentCoeff, 0);

  return sum / messages.length;
}

// export function silhouetteCoeffPerCluster(clusteredPoints: number[][][]) {
//   const messages = clusteredPoints.map(
//         .map((message) => {
//           const { a, b } = inOutDistancePerPoint(message, clusteredPoints);
//           return silhouetteCoeffPerPoint(a, b);
//         })
//         .reduce((sum, currentCoeff) => sum + currentCoeff, 0) / cluster.messages.length,
//   );

//   return messages;
// }

//used to identify closest and second closest
//TODO: check if there is at least more than 2 clusters
export function sortClustersByDistFromPoint(
  centroids: number[][],
  point: number[],
  nClusters: number = 2,
) {
  const distances = distanceFromCentroids(centroids, point);
  //sort distances, return index of the distances
  // const sortedDistances = distances.sort((a, b) => a.distance - b.distance)

  const result = Array.from(distances.keys()).sort((a, b) => distances[b] - distances[a]);

  return result.slice(0, nClusters);
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

export function inOutDistancePerPoint(point: number[], clusteredPoints: number[][][]) {
  //get centroids
  const centroidsFromCluster = centroidsTest(clusteredPoints);
  //get closest clusters
  const twoClosestClusters = sortClustersByDistFromPoint(centroidsFromCluster, point);

  const embeddingA = clusteredPoints[twoClosestClusters[0]];
  const embeddingB = clusteredPoints[twoClosestClusters[1]];

  const distA = calculateDistanceAgainstPoints(point, embeddingA);
  const distB = calculateDistanceAgainstPoints(point, embeddingB);

  return { a: distA, b: distB };
}
