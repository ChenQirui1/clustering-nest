//for each cluster,get each embedding, sum them up, divide by number of embeddings

export const centroids = (clusters: {}) =>
  Object.values(clusters).map((cluster: number[][]) => {
    const sum = cluster.reduce(
      (sum, embedding) => {
        return sum.map((sum, index) => sum + embedding[index]);
      },
      [0, 0],
    );
    return sum.map((sum) => sum / cluster.length);
  });

function nearestToCentroid(clusters) {}
