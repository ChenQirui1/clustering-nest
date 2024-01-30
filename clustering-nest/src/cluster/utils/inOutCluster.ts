//data: array of array of number
//containings core points in cluster and edge points
import { KMEANS } from 'density-clustering';
import { silhouetteCoeff } from './silhouette';

export function kmeansInOutCluster(
  newPoint: number[],
  data: number[][],
  clusterLength: number,
) {
  //test in cluster and out cluster
  const kmeans = new KMEANS();

  //add new point to existing data points
  data.push(newPoint);

  //in cluster
  const inCluster = kmeans.run(data, clusterLength);

  const inClusterEmbeddings = inCluster.map((cluster) =>
    cluster.map((index) => data[index]),
  );

  //out cluster
  const outCluster = kmeans.run(data, clusterLength + 1);

  const outClusterEmbeddings = outCluster.map((cluster) =>
    cluster.map((index) => data[index]),
  );

  //scoring with silhouette
  const inClusterScore = silhouetteCoeff(inClusterEmbeddings);
  const outClusterScore = silhouetteCoeff(outClusterEmbeddings);

  if (inClusterScore > outClusterScore) {
    //in cluster
    //assign new point to the cluster

    //find the point in the result that is the new point
    const indexOfClusterWithNewPoint = inCluster.findIndex((cluster) =>
      cluster.includes(data.length + 1),
    );

    return indexOfClusterWithNewPoint;
  } else {
    //out cluster
    //create new cluster
    return clusterLength + 1;
  }
}
