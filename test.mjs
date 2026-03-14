import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

// GROQ_API_KEY should be set in environment

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
