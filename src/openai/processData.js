// This code is for v4 of the openai package: npmjs.com/package/openai
import OpenAI from "openai";
import "dotenv/config";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function transform(transformResponse, time) {
  const transform = { ...transformResponse, time: time };
  // console.log(feedbackForm)
  //append to json file
  fs.appendFile("transformed.json", JSON.stringify(transform), function(err) {
    if (err) throw err;
    console.log("Saved!");
  });
  return transform;
}

// const test = {
//   q2: "Comic book enthusiast",
//   q3: "Ease of reading and accessibility",
//   q4: "Include more customization options for the reading experience and add more stuff to the website",
// };

export async function runConversation(condition) {
  //Note the updated model and added functions and function_call lines
  //Note that we pass our schema object to parameters

  // const product = "comic book reader app";
  // const schema = [
  //   {
  //     name: "transform_feedback",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         q2: {
  //           type: "array",
  //           items: { type: "string" },
  //         },
  //         q3: {
  //           type: "array",
  //           items: { type: "string" },
  //         },
  //         q4: {
  //           type: "array",
  //           items: { type: "string" },
  //         },
  //       },
  //     },
  //   },
  // ];

  const schema = [
    {
      name: "transform_feedback",
      parameters: {
        type: "object",
        properties: {
          entities: {
            type: "array",
            items: { type: "string" },
          },
          benefits: {
            type: "array",
            items: { type: "string" },
          },
          tasks: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
  ];

  const messages = [
    {
      role: "system",
      content: `You are a data transformer.`,
    },
    // {
    //   role: "user",
    //   content: `For each of the question response:\n    Q2: ${test.q2}\n    Q3: ${test.q3}\n    Q4:${test.q4}\n\nTransformations\nQ2: Extract entities in the text\nQ3: Extract the benefits individually, reword in SVO\nQ4: Extract the suggestions separately, reword in actionable tasks\n\nFormat in JSON`,
    // },
    // {
    //   role: "user",
    //   content: `For each of the question response:\n    entities: ${test.q2}\n    benefits: ${test.q3}\n    suggestions: ${test.q4}\n\nTransformations\nQ2: Extract entities(people, organisations) \nQ3: Separate the individual benefits, rephrase them in subject-verb order \nQ4: Separate the suggestions, reword in actionable tasks\n\nFormat in JSON`,
    // },
    {
      role: "user",
      content: `For each of the question response:\n    entities: ${condition.entities}\n    benefits: ${condition.benefits}\n    suggestions: ${condition.tasks}\n\nTransformations\nQ2: Extract entities in the text\nQ3: Extract the benefits individually, reword in SVO\nQ4: Extract the suggestions individually, reword in actionable tasks\n\nFormat in JSON:\nentities: list\nbenefits: list\nsuggestions: list`,
    },
  ];

  const response = await openai.chat.completions
    .create({
      model: "gpt-4-1106-preview",
      messages: messages,
      functions: schema,
      function_call: "auto",
      temperature: 0,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: { type: "json_object" },
    })
    .then((response) => {
      // console.log(response);
      const responseMessage = response.choices[0].message;
      // console.log(responseMessage);
      // console.log(JSON.parse(responseMessage.content));
      if (responseMessage.function_call) {
        const functionArgs = JSON.parse(
          responseMessage.function_call.arguments
        );
        console.log(functionArgs);
        transform(functionArgs, condition.time);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
