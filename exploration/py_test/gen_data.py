import os
import openai
import dotenv
import json

config = dotenv.dotenv_values(".env")

openai.api_key = config['OPENAI_API_KEY']

functions = [
    {
        "name": "get_current_feedback",
        "description": "Get the response in a given format.",
        "parameters": {
            "type": "object",
            "properties": {
                "Q1": {"type": "string", "enum": ["Less Disappointed", "Neutral", "Very Disappointed"]},
                "Q2": {"type": "string"},
                "Q3": {"type": "string"},
                "Q4": {"type": "string"},
            },
        },
    },
]

messages = [{
    "role": "system",
    "content": "You are a customer that is using a comic book reader app. \nYou left this comment in the past.\n\"\"\"\nPlease fix the scaling problem? The latest update has a problem with scaling the images. Now  no matter what I have the \"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"fit to\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\" option set to  I still have to manually scroll up  down  right and left to see the whole image. It doesn't seem like it  but believe me it's very annoying.\"\"\n\"\"\"\n\n"
},
    {
    "role": "user",
            "content": "Provide response for these questions.\n\"\"\"\nQ1: How would you feel if this product no longer exists?\nQ2: What type of people do you think would most benefit from this product?\nQ3: What is the main benefit you receive from this product?\nQ4: How can we improve this product for you?\n\"\"\"\n"
}]


response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=messages,
    functions=functions,
    function_call="auto",
    temperature=2,
    max_tokens=256,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0)

# functionCall = response.choices[0].message.function_call

print(response)


# get_json = <Cat>JSON.parse(functionCall.arguments);
# # write or append response json to a file 'response.json'
# with open('response.json', 'a+') as outfile:
#     json.dump(response, outfile)


# Example dummy function hard coded to return the same weather
# In production, this could be your backend API or an external API
# def get_current_feedback(Q1, Q2, Q3, Q4):
#     """Get the current weather in a given location"""
#     weather_info = {
#         "Q1": Q1,
#         "Q2": Q2,
#         "Q3": Q3,
#         "Q4": Q4,
#     }
#     return json.dumps(weather_info)


# def run_conversation():
#     # Step 1: send the conversation and available functions to GPT
#     messages = [{
#         "role": "system",
#         "content": "You are a customer that is using a comic book reader app. \nYou left this comment in the past.\n\"\"\"\nPlease fix the scaling problem? The latest update has a problem with scaling the images. Now  no matter what I have the \"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"fit to\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\" option set to  I still have to manually scroll up  down  right and left to see the whole image. It doesn't seem like it  but believe me it's very annoying.\"\"\n\"\"\"\n\n"
#     },
#         {
#             "role": "user",
#             "content": "Provide response for these questions.\n\"\"\"\nQ1: How would you feel if this product no longer exists?\nQ2: What type of people do you think would most benefit from this product?\nQ3: What is the main benefit you receive from this product?\nQ4: How can we improve this product for you?\n\"\"\"\n"
#     }]
#     functions = [
#         {
#             "name": "get_current_feedback",
#             "description": "Get the response in a given format.",
#             "parameters": {
#                 "type": "object",
#                 "properties": {
#                     "Q1": {"type": "string", "enum": ["Less Disappointed", "Neutral", "Very Disappointed"]},
#                     "Q2": {"type": "string"},
#                     "Q3": {"type": "string"},
#                     "Q4": {"type": "string"},
#                 },
#             },
#         },
#     ],
#     function_call = {"name": "createCatObject"}

#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo-0613",
#         messages=messages,
#         functions=functions,
#         function_call="auto",  # auto is default, but we'll be explicit
#     )
#     response_message = response["choices"][0]["message"]

#     # Step 2: check if GPT wanted to call a function
#     if response_message.get("function_call"):
#         # Step 3: call the function
#         # Note: the JSON response may not always be valid; be sure to handle errors
#         available_functions = {
#             "get_current_feedback": get_current_feedback,
#         }  # only one function in this example, but you can have multiple
#         function_name = response_message["function_call"]["name"]
#         function_to_call = available_functions[function_name]
#         function_args = json.loads(
#             response_message["function_call"]["arguments"])
#         function_response = function_to_call(
#             Q1=function_args.get("Q1"),
#             Q2=function_args.get("Q2"),
#             Q3=function_args.get("Q3"),
#             Q4=function_args.get("Q4"),
#         )

#         # Step 4: send the info on the function call and function response to GPT
#         # extend conversation with assistant's reply
#         messages.append(response_message)
#         messages.append(
#             {
#                 "role": "function",
#                 "name": function_name,
#                 "content": function_response,
#             }
#         )  # extend conversation with function response
#         second_response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo-0613",
#             messages=messages,
#         )  # get a new response from GPT where it can see the function response
#         return second_response


# print(run_conversation())
