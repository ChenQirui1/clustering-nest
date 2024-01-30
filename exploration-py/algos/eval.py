from matplotlib import pyplot as plt
from inOutKmeans import InOutKmeans
from data import X_pca
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np

model = InOutKmeans()

model._points_in_centroids
labels = []
data_seen = []
# for idx,i in enumerate(X_pca):
#     labels.append(model.predict(i,cutoff=0.2))
#     #plot existing data
#     #plot new data

# show centroids
centroids = np.array(model._centroids)
# plt.scatter(x=centroids[:,0],y=centroids[:,1],c='black',s=200,marker='x')
print("centroids ", centroids)
for idx, i in enumerate(X_pca):
    labels.append(model.predict(i, cutoff=6))
    # plot existing data
    data_seen.append(i)
    test = np.array(data_seen)
    # plot new data
    plt.scatter(test[:, 0], test[:, 1], c=labels)
    # show centroids
    print(len(model._centroids))
    centroids = np.array(model._centroids)
    plt.scatter(x=centroids[:, 0], y=centroids[:, 1],
                c='black', s=200, marker='x')
    print("centroids ", centroids)
    # sabe figure to folder: "testfigure"
    plt.savefig("testbenefits/"+str(idx)+".png")
    plt.clf()
