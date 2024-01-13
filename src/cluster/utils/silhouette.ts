import cluster from 'cluster';
import { centroidsTest, distanceFromCentroids } from './centroid';

//formula for silhoutte coefficient
//https://scikit-learn.org/stable/modules/clustering.html#silhouette-coefficient
function silhouetteCoeffPerPoint(point: number[], clusters: number[][][]) {
  //get the cluster that the point is in and out of in a object spread
  const inCluster: number[][] = clusters.find((cluster) => cluster.includes(point));
  const outCluster: number[][][] = clusters.filter((cluster) => !cluster.includes(point));

  function a(i: number[]) {
    //if the point is the only point in the cluster, return 0
    if (inCluster.length === 1) {
      return 0;
    }
    const sum = inCluster.reduce(
      (sum, currentPoint) => (currentPoint != i ? sum + euDistance(i, currentPoint) : sum),
      0,
    );

    return sum / (inCluster.length - 1);
  }

  function b(i: number[]) {
    //filter out the cluster that i is in
    const distances = outCluster.map((cluster) => {
      const sum = cluster.reduce(
        (sum, currentPoint) => (currentPoint != i ? sum + euDistance(i, currentPoint) : sum),
        0,
      );
      return sum / cluster.length;
    });
    return Math.min(...distances);
  }

  //formula for silhoutte coefficient
  const s = (b(point) - a(point)) / Math.max(a(point), b(point));
  // console.log('a', a(point));
  // console.log('b', b(point));
  // console.log('s', s)// ;
  return s;
}

export function silhouetteCoeff(clusteredPoints: number[][][]) {
  //original points
  const messages = clusteredPoints.flat();

  const sum = messages
    .map((message) => silhouetteCoeffPerPoint(message, clusteredPoints))
    .reduce((sum, currentCoeff) => sum + currentCoeff, 0);
  // console.log('sum', sum);
  return sum / messages.length;
}

export function testRun(clusteredPoints: number[][][], diffCutoff: number): boolean {
  const overallScore = silhouetteCoeff(clusteredPoints);
  console.log('overallScore', overallScore);

  //test whether the cluster pass the overall score
  const approxClusterSize = clusteredPoints.flat().length / clusteredPoints.length;

  for (let i = 0; i < clusteredPoints.length; i++) {
    //for each cluster
    let passFlag = false;
    console.log('cluster', i);
    for (let j = 0; j < clusteredPoints[i].length; j++) {
      const score = silhouetteCoeffPerPoint(clusteredPoints[i][j], clusteredPoints);
      console.log('score point', j, score);
      if (score > overallScore) {
        //if a point in the cluster reach the line, considered as pass
        passFlag = true;
        break;
      }
    }
    //early stop upon failure
    if (passFlag === false) {
      return false;
    }

    console.log('cluster', i, 'pass');
    //test whether the cluster pass the size check

    const size = clusteredPoints[i].length;
    const cutoff = Math.abs((approxClusterSize - size) / approxClusterSize);
    if (cutoff > diffCutoff) {
      return false;
    }
  }

  //all is good
  return true;
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

//OLD
export function silhouetteCoeffPerPointOld(a: number, b: number) {
  return (b - a) / Math.max(a, b);
}

export function silhouetteCoeffOld(clusteredPoints: number[][][]) {
  //original points
  const messages = clusteredPoints.flat();

  const sum = messages
    .map((message) => {
      const { a, b } = inOutDistancePerPoint(message, clusteredPoints);
      return silhouetteCoeffPerPointOld(a, b);
    })
    .reduce((sum, currentCoeff) => sum + currentCoeff, 0);

  return sum / messages.length;
}

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
