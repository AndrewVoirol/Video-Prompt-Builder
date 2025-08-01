import fs from "fs/promises";
import { promptIntents } from "../lib/intents";

async function seed() {
  for (const intent of promptIntents) {
    const dir = `./prompts/${intent.domain || "general"}`;
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      `${dir}/${intent.id}.json`,
      JSON.stringify(intent, null, 2),
    );
  }
  console.log("Seeded prompts from intent catalog!");
}
seed();
