import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


class InOutKmeansOld():
    def __init__(self):
        self._centroids = []
        # self._points_in_centroids = []
        self.data = []

    def predict(self, newPoint):
        if self._centroids:

            inCluster = KMeans(n_clusters=len(self._centroids),
                               random_state=0).fit_predict(self.data)

            mergeData = np.concatenate((self.data, newPoint), axis=0)
            outCluster = KMeans(n_clusters=len(self._centroids)+1,
                                random_state=0).fit_predict(mergeData)

            inScore = silhouette_score(self.data, inCluster)

            outScore = silhouette_score(self.data, outCluster)

            if inScore < outScore:
                # new cluster
                self._centroids.append()
                return len(self._centroids)-1

            else:

                # return point to cluster
                label = outCluster[-1]

                return label

        else:
            # assign first point to cluster
            self._centroids.append(newPoint)
            return 0


class InOutKmeans():
    def __init__(self):
        self._centroids = []
        # self._points_in_centroids = []
        self.data = []

    def predict(self, newPoint):
        if len(self._centroids) >= 2:

            self.data.append(newPoint)

            inCluster = KMeans(n_clusters=len(self._centroids),
                               random_state=0).fit_predict(self.data)

            outCluster = KMeans(n_clusters=len(self._centroids)+1,
                                random_state=0).fit_predict(self.data)

            inScore = silhouette_score(self.data, inCluster)

            outScore = silhouette_score(self.data, outCluster)

            if inScore < outScore:
                # new cluster
                self._centroids.append(newPoint)
                return len(self._centroids)-1

            else:

                # return point to cluster
                label = outCluster[-1]

                return label

        elif (len(self._centroids) == 1):
            self.data.append(newPoint)
            self._centroids.append(newPoint)
            return 1
        else:
            # assign first point to cluster
            self._centroids.append(newPoint)
            self.data.append(newPoint)
            return 0
