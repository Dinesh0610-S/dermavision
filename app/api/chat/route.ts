import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getApiUrl } from '@/lib/api-config';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, user_id } = await req.json();

  const result = streamText({
    model: groq('llama-3.1-8b-instant') as any,
    system: `You are the DermaVision Symptom AI, an expert virtual dermatologist and medical doctor.
Your tone is professional, empathetic, and clinical but easy to understand.
You are speaking directly to a patient about their skin and overall health.
Provide insightful, scientifically accurate medical context based on the symptoms they describe.
If they describe symptoms like acne, redness, moles, or dryness, provide specific dermatological knowledge (e.g., mentioning the ABCDE rule for moles, or atopic dermatitis for itching).
At the end of your response, always kindly remind the user that AI can make mistakes and they should consult a real doctor for a formal medical diagnosis.`,
    messages,
    onFinish: async (event) => {
      try {
        const user_message = messages.length > 0 ? messages[messages.length - 1].content : ""
        const ai_response = event.text
        
        await fetch(getApiUrl("/api/log_symptom"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                user_id: user_id || 1, 
                symptoms: user_message, 
                ai_prediction: ai_response 
            })
        });
        
        await fetch(getApiUrl("/api/save_chat"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                user_id: user_id || 1, 
                user_message: user_message, 
                bot_response: ai_response 
            })
        });
      } catch (e) {
        console.error("Failed to log symptom to DB", e)
      }
    }
  });

  return result.toDataStreamResponse();
}
