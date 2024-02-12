from datasets import load_dataset_builder, get_dataset_config_names, load_dataset
import pandas as pd

# ds_configs = get_dataset_config_names("app_reviews")
ds_load = load_dataset("app_reviews")
ds_load = ds_load["train"]

# to pandas dataframe
df = ds_load.to_pandas()
print(df.head())

df = df[df["package_name"] == "org.telegram.messenger"]
# date to datetime pandas
df["date"] = pd.to_datetime(df["date"])

# sort by date and index
df = df.sort_values(by="date")

# reset index
df = df.reset_index(drop=True)

# save to csv
df.to_csv("telegram_reviews.csv", index=False)
