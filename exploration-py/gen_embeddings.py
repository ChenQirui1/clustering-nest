import os
from dotenv import load_dotenv
from openai import OpenAI
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import pandas as pd
from tqdm import tqdm
import json

nltk.download("stopwords")
nltk.download("punkt")

tqdm.pandas()
# create client object with api key using dotenv
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")  # get the api key from the .env file
client = OpenAI(api_key=api_key)


def gen_embeddings(text):
    try:
        response = client.embeddings.create(input=text, model="text-embedding-3-small")
        return response.data[0].embedding
    except Exception as e:
        # return the error message string
        return repr(e)


# nltk stopwords
def remove_stopwords(text):
    stop_words = set(stopwords.words("english"))
    word_tokens = word_tokenize(text)
    filtered_text = [word for word in word_tokens if word.lower() not in stop_words]
    return " ".join(filtered_text)


print(
    remove_stopwords(
        "This is a sample sentence, showing off the stop words filtration."
    )
)

df = pd.read_csv("telegram_reviews.csv")

# remove stopwords
df["review_stopwords"] = df["review"].apply(remove_stopwords)

# # append to text file
# with open("telegram_reviews_embeddings.txt", "a") as f:
#     for review in df["review"]:
#         f.write(gen_embeddings(review) + "\n")


def append_to_file(filename, data):
    with open(filename, "a") as f:
        f.write(data + ",\n")


for index, row in tqdm(df.iterrows()):
    row_dict = row.to_dict()

    row_dict["embedding"] = gen_embeddings(row_dict["review_stopwords"])
    append_to_file("telegram_reviews_embeddings.json", json.dumps(row_dict))
