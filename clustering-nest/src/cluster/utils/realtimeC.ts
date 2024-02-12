// euclidean distance func
export function euDistance(a: number[], b: number[]) {
  // using hypo, higher accuracy but may be slow
  // return Math.hypot(...Object.keys(a).map((k) => b[k] - a[k]));

  return Math.sqrt(
    a.reduce((accum, curr, idx) => (accum + (b[idx] - curr)) ** 2, 0),
  );
}

function cosineSimilarity(a: number[], b: number[]) {
  const normA = Math.sqrt(a.reduce((accum, curr) => accum + curr ** 2, 0));
  const normB = Math.sqrt(b.reduce((accum, curr) => accum + curr ** 2, 0));

  const sum = a.reduce((accum, curr, idx) => accum + b[idx] * curr, 0);

  return sum / (normA * normB);
}

/* ! eucliean distance and cos sim are related proportionally:
 https://medium.com/ai-for-real/relationship-between-cosine-similarity-and-euclidean-distance-7e283a277dff

 the embeddings use are normalised vectors so the above article may hold true,
 not very sure if there will be meaningful difference between the two measures


 euDist may be more performant than cos sim, up to u
*/

//centroids are arbitrary

function realTimeCluster(
  distance_func: (a: number[], b: number[]) => number,
  centroids: number[][],
  new_data: number[],
  cutoff: number,
) {
  if (centroids) {
    //get index of nearest cluster
    const indexOfClosestCluster = centroids.reduce(
      (minIdx, currentCentroid, currentIdx) =>
        distance_func(new_data, currentCentroid) <
        distance_func(new_data, centroids[minIdx])
          ? currentIdx
          : minIdx,
      0,
    );

    if (distance_func(new_data, centroids[indexOfClosestCluster]) > cutoff) {
      return centroids.length - 1;
    } else {
      return indexOfClosestCluster;
    }
  } else {
    return 0;
  }
}

function movingAverage(new_data: number[], data: number[][]) {
  data.push(new_data);
  let arrLength = data.length;
  return (
    data
      //sum up all points
      .reduce((sum, point) => sum.map((val, index) => val + point[index]), [])
      //divide by number of points
      .map((sum) => sum / arrLength)
  );
}

function expMovingAverage(
  new_data: number[],
  centroid: number[],
  decay_rate: number = 0.9,
) {
  // exponential filter
  return centroid.map(
    (point, idx) => decay_rate * point + (1 - decay_rate) * new_data[idx],
  );
}

//when getting the nearest point as representive of a cluster
//general case, given list of embeddings,return the representative
function nearestPointToCentroid(
  distance_func: (a: number[], b: number[]) => number,
  centroid: number[],
  data: number[][],
) {
  //get index of nearest cluster
  return data.reduce(
    (minIdx, currentCentroid, currentIdx) =>
      distance_func(centroid, currentCentroid) <
      distance_func(centroid, data[minIdx])
        ? currentIdx
        : minIdx,
    0,
  );
}

//setup
let centroids = [
  [1, 2, 3],
  [4, 5, 6],
];

let pointsInOneCluster = [
  [2, 3, 2],
  [3, 4, 1],
  [3, 4, 1],
  [3, 4, 2],
];
let newPoint = [1, 2.5, 4];

// sample flow
//first predict the cluster, get the possible cluster, same for both rtmac or rtefc
const assignedCluster = realTimeCluster(euDistance, centroids, newPoint, 0.03);

//second, recalculate cluster centroid, this step can be offline
//rtmac
const recalc_rtmac = movingAverage(newPoint, pointsInOneCluster);

// rtefc which uses expontial instead
const recalc_rtefc = expMovingAverage(newPoint, centroids[0]);
