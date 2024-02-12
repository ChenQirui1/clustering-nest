import timeit
from matplotlib import pyplot as plt
from inOutKmeans import InOutKmeans
from realtime import RTEFC, RealtimeCluster
from data import process_data
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np
from sklearn.metrics import silhouette_score

rtefc = RTEFC()
rtmac = RealtimeCluster()

# model._points_in_centroids
labels = []
data_seen = []
# for idx,i in enumerate(X_pca):
#     labels.append(model.predict(i,cutoff=0.2))
#     #plot existing data
#     #plot new data

X, df = process_data("../data/benefits_transformed.json")

# show centroids
# centroids = np.array(model._centroids)
# plt.scatter(x=centroids[:,0],y=centroids[:,1],c='black',s=200,marker='x')


def test_cluster(X, model):
    for idx, i in enumerate(X):
        label = model.predict(i, cutoff=0.1)
        labels.append(label)

    return silhouette_score(X, labels)


# timeit
# test_cluster(X, model)

# df['labels'] = labels
# df.to_csv('output.csv', index=False)
print(timeit.timeit("test_cluster(X,rtefc)", globals=globals(), number=1))
print(timeit.timeit("test_cluster(X,rtmac)", globals=globals(), number=1))


# ploting
# for idx, i in enumerate(X):
#     labels.append(model.predict(i, cutoff=0.1))
#     # plot existing data
#     data_seen.append(i)
#     test = np.array(data_seen)
#     # plot new data
#     plt.scatter(test[:, 0], test[:, 1], c=labels)
#     # show centroids
#     # print(len(model._centroids))
#     centroids = np.array(model._centroids)
#     plt.scatter(x=centroids[:, 0], y=centroids[:, 1],
#                 c='black', s=200, marker='x')
#     print("centroids ", centroids)
#     # sabe figure to folder: "testfigure"
#     plt.savefig("outputImg/realtime_"+str(idx)+".png")
#     plt.clf()
