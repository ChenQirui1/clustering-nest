from datasets import load_dataset_builder, get_dataset_config_names, load_dataset
ds_builder = load_dataset_builder("app_reviews")
# ds_configs = get_dataset_config_names("app_reviews")
ds_load = load_dataset("app_reviews")

# print(ds_builder.info.description)

# print(ds_builder.info.features)
# print(ds_configs)
