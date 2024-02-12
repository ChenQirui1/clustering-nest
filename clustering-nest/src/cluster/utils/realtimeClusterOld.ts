import { euDistance } from './scoring';

export class realTimeCluster {
  private centroids: number[][] = [];
  realTimeCluster(
    newPoint: number[],
    data: number[][],
    eps: number = 0.5,
    centroids: number[][],
  ) {
    let distances: number[] = [];

    //calculate distance to each centroid O(k)
    if (this.centroids.length) {
      for (let i = 0; i < this.centroids.length; i++) {
        const distance = euDistance(newPoint, this.centroids[i]);
        distances.push(distance);
      }

      const indexOfClosestCluster = argmin(distances);

      if (distances[indexOfClosestCluster] > eps) {
        //new cluster
        this.centroids.push(newPoint);
        return this.centroids.length - 1;
      } else {
        //existing cluster
        // add to existing points in cluster
        // retrieve cluster data

        // inject relevant data of the centroid
        data.push(newPoint);

        const newCentroid = data
          .reduce(
            (sum, point) => sum.map((val, index) => val + point[index]),
            [],
          )
          .map((sum) => sum / data.length);

        this.centroids[indexOfClosestCluster] = newCentroid;
        return indexOfClosestCluster;
      }
    } else {
      //initial case when stream is empty
      this.centroids.push(newPoint);
      return centroids.length - 1;
    }
  }
}
