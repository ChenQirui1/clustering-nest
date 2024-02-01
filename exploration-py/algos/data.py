from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np
import json
from matplotlib import pyplot as plt


def process_data(json_path):
    df = pd.read_json(json_path)
    df = df.dropna(subset=['embeddings'])

    # load task_transformed.json
    with open(json_path) as json_file:
        data = json.load(json_file)

    # save all embeddings in a 2d array
    embeddings = []

    for task in data:
        if task['embeddings'] is not None:
            embeddings.append(task['embeddings'])

    # convert embeddings to numpy array
    X = np.array(embeddings)
    X.shape

    # standardize X
    # X = (X - np.mean(X,axis=0)) / np.std(X,axis=0)
    scaler = StandardScaler()
    scaler.fit(X)
    standardised_X = scaler.transform(X)
    print(np.std(standardised_X, axis=0))
    print(np.mean(standardised_X, axis=0))

    pca = PCA(n_components=2)
    pca.fit(X)
    X_pca = pca.transform(X)
    return X_pca, df
