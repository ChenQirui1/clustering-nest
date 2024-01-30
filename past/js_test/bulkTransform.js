// An import assertion in a static import
import info from "./processed_data.json" assert { type: "json" };
import { runConversation } from "./processData.js";

//generate data based on the dataset in test2.json
for await (const contents of info.map((entry) => ({
  entities: entry.q2,
  benefits: entry.q3, // comic book reader app
  tasks: entry.q4,
  time: entry.time,
}))) {
  console.log(contents);
  await runConversation(contents);
}
