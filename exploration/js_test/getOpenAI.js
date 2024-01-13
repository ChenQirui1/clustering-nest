// This code is for v4 of the openai package: npmjs.com/package/openai
import OpenAI from "openai";
import "dotenv/config";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function feedback(feedbackFormResponse, time) {
  const feedbackForm = { ...feedbackFormResponse, time: time };
  // console.log(feedbackForm)
  //append to json file
  fs.appendFile("data3.json", JSON.stringify(feedbackForm), function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
  return feedbackForm;
}

export async function runConversation(condition) {
  //Note the updated model and added functions and function_call lines
  //Note that we pass our schema object to parameters

  // const product = "comic book reader app";
  const schema = [
    {
      name: "get_feedback",
      parameters: {
        type: "object",
        properties: {
          q1: {
            type: "string",
            description: "Descriptive title of the dish",
            enum: [
              "Not Disappointed",
              "Somewhat Disappointed",
              "Very Disappointed",
            ],
          },
          q2: {
            type: "string",
            items: { type: "string" },
          },
          q3: {
            type: "string",
            items: { type: "string" },
          },
          q4: {
            type: "string",
            items: { type: "string" },
          },
        },
      },
    },
  ];

  const messages = [
    {
      role: "system",
      content: `You are a customer that is using a ${condition.product}.  \nYou left this comment in the past.\n"""\n ${condition.sample}`,
    },
    {
      role: "user",
      content:
        'Provide response for these questions.\n"""\nQ1: How would you feel if this product no longer exists?\nQ2: What type of people do you think would most benefit from this product?\nQ3: What is the main benefit you receive from this product?\nQ4: How can we improve this product for you?\n"""\nDesired format: JSON \n{\nQ1: one of these options: [Less Disappointed, Neutral, Very Disappointed]\nQ2: Free text\nQ3: Free text\nQ4: Free text\n}',
    },
  ];

  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo-16k-0613",
      messages: messages,
      functions: schema,
      function_call: "auto",
      temperature: 1,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((response) => {
      const responseMessage = response.choices[0].message;
      if (responseMessage.function_call) {
        const functionArgs = JSON.parse(
          responseMessage.function_call.arguments
        );
        feedback(functionArgs, condition.time);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// console.log(runConversation(test));
