from openai import OpenAI
from dotenv import load_dotenv,find_dotenv
import os
import pandas as pd
import numpy as np
import ast
from tqdm import tqdm
load_dotenv(find_dotenv('.env'))

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def gen_embeddings(text):

    try:
        response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text,
        encoding_format="float"
        )
        return response.data[0].embedding
    except:
        return np.nan
 
def genData(df: pd.DataFrame):
    data = df[df.columns[1]].progress_apply(gen_embeddings)
    df['embeddings'] = data
    return df
             
             
if __name__ == "__main__":
    
    tqdm.pandas()
    df = pd.read_csv('./py_test/tasks.csv')
    df = genData(df)
    df.to_json('./py_test/tasks_transformed.json',orient='records')