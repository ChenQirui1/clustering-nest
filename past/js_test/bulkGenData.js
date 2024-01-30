// An import assertion in a static import
import info from "./processed_data.json" assert { type: "json" };
import { runConversation } from "./getOpenAI.js";

//generate data based on the dataset in test2.json
for await (const contents of info.map((entry) => ({
  sample: entry.review,
  product: "a comic book reader app", // comic book reader app
  time: entry.date,
}))) {
  console.log(contents);
  await runConversation(contents);
}
