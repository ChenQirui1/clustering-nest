import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import 'dotenv/config';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  constructor(private configService: ConfigService) {}
  private openai = new OpenAI({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: this.configService.get<string>('OPENAI_API_KEY'),
  });
  getClient() {
    return this.openai;
  }

  //   async runConversation(condition) {
  //     //Note the updated model and added functions and function_call lines
  //     //Note that we pass our schema object to parameters

  //     const schema = [
  //       {
  //         name: 'transform_feedback',
  //         parameters: {
  //           type: 'object',
  //           properties: {
  //             entities: {
  //               type: 'array',
  //               items: { type: 'string' },
  //             },
  //             benefits: {
  //               type: 'array',
  //               items: { type: 'string' },
  //             },
  //             tasks: {
  //               type: 'array',
  //               items: { type: 'string' },
  //             },
  //           },
  //         },
  //       },
  //     ];

  //     const messages = [
  //       {
  //         role: 'system',
  //         content: `You are a data transformer.`,
  //       },
  //       {
  //         role: 'user',
  //         content: `For each of the question response:\n    entities: ${condition.entities}\n    benefits: ${condition.benefits}\n    suggestions: ${condition.tasks}\n\nTransformations\nQ2: Extract entities in the text\nQ3: Extract the benefits individually, reword in SVO\nQ4: Extract the suggestions individually, reword in actionable tasks\n\nFormat in JSON:\nentities: list\nbenefits: list\nsuggestions: list`,
  //       },
  //     ];

  //     const response = await this.openai.chat.completions
  //       .create({
  //         model: 'gpt-4-1106-preview',
  //         messages: messages,
  //         functions: schema,
  //         function_call: 'auto',
  //         temperature: 0,
  //         max_tokens: 512,
  //         top_p: 1,
  //         frequency_penalty: 0,
  //         presence_penalty: 0,
  //         response_format: { type: 'json_object' },
  //       })
  //       .then((response) => {
  //         // console.log(response);
  //         const responseMessage = response.choices[0].message;
  //         // console.log(responseMessage);
  //         // console.log(JSON.parse(responseMessage.content));
  //         if (responseMessage.function_call) {
  //           const functionArgs = JSON.parse(responseMessage.function_call.arguments);
  //           console.log(functionArgs);
  //           transform(functionArgs, condition.time);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
}
