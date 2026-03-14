import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
});

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
    console.error("SDK Error Name:", e.name);
    console.error("SDK Error Message:", e.message);
    if (e.cause) console.error("Cause:", e.cause);
  }
}

main();
