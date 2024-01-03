import info from "./transformed.json" assert { type: "json" };

//generate data based on the dataset in test2.json
for (const contents of info) {
  contents.benefits;
  console.log(contents);
  await runConversation(contents);
}
