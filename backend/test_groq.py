import os
from groq import Groq

# Set API key explicitly
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

try:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Explain the importance of fast language models",
            }
        ],
        model="llama-3.1-8b-instant",
    )
    print("SUCCESS: ", chat_completion.choices[0].message.content)
except Exception as e:
    print("GROQ ERROR OCCURRED:")
    import traceback
    traceback.print_exc()
