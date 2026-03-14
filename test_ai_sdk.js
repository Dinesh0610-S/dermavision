const { groq } = require('@ai-sdk/groq');
const { generateText } = require('ai');
require('dotenv').config({ path: '.env.local' });

async function main() {
  try {
    console.log("Starting SDK...");
    const result = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: "You are DermaVision.",
      messages: [{ role: 'user', content: 'Hi' }],
    });
    console.log("Success:", result.text);
  } catch (e) {
    console.error("SDK Error:", e);
  }
}

main();
