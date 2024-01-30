import numpy as np


class RealtimeCluster():
    def __init__(self):
        self._centroids = []
        self._points_in_centroids = []

    def predict(self, data, cutoff=3):
        if self._centroids:
            distances = []
            # calculate euclidean distance
            for centroid in self._centroids:
                distance = np.linalg.norm(data-centroid)
                # print(distance)
                distances.append(distance)

            # argmin returns index of minimum value
            index_closest_distance = np.argmin(distances)
            # print("index of distance ", index_closest_distance)

            if distances[index_closest_distance] > cutoff:
                # new cluster
                self._centroids.append(data)
                self._points_in_centroids.append([data])
                return len(self._centroids)-1

            else:
                # argmin returns index of minimum value
                # closest centroid
                # assign point to cluster
                label = index_closest_distance
                # print(label)

                # recalibrate centroid
                # can be background task
                self._points_in_centroids[label].append(data)
                new_centroids = np.mean(
                    self._points_in_centroids[label], axis=0)
                self._centroids[label] = new_centroids

                return label

        else:
            # assign first point to cluster
            self._centroids.append(data)
            self._points_in_centroids.append([data])
            return len(self._centroids)-1
