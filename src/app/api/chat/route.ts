import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.error("GROQ_API_KEY is missing from environment variables.");
      return NextResponse.json({ error: "Groq API Key not configured" }, { status: 500 });
    }

    const lastUserMessage = messages[messages.length - 1].content;
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";
    
    // Models: Primary and Fallback
    const models = ["llama-3.1-8b-instant", "llama-3.1-70b-versatile"];
    let aiReply = "";
    let lastError = null;

    for (const model of models) {
      try {
        console.log(`Attempting chat with model: ${model}`);
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { 
                role: "system", 
                content: `You are Vently, a calm emotional AI. Talk like a human, be soft and understanding. 
                
                You also have a "Healing Space" feature that offers guided Yoga, Meditation, Nutrition advice, BMI checking, Sleep care, Hydration tracking, and Posture exercises.
                
                If the user seems stressed, anxious, tired, or expresses a need for physical/mental wellness, gently suggest they visit the "Healing Space" (/healing) and recommend a specific category like Meditation or Sleep Care.
                
                Keep suggestions natural and supportive.` 
              },
              { role: "user", content: lastUserMessage }
            ]
          }),
        });

        const data = await res.json();

        if (res.ok) {
          aiReply = data.choices?.[0]?.message?.content;
          if (aiReply) break; // Success!
        } else {
          console.error(`Error with model ${model}:`, data.error?.message || "Unknown error");
          lastError = data.error?.message;
          // Continue to fallback model if this one is decommissioned or fails
          continue;
        }
      } catch (err: any) {
        console.error(`Fetch error with model ${model}:`, err.message);
        lastError = err.message;
        continue;
      }
    }

    if (!aiReply) {
      return NextResponse.json(
        { error: lastError || "All AI models failed to respond. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ content: aiReply });

  } catch (error: any) {
    console.error("Backend Chat Route Critical Error:", error);
    return NextResponse.json(
      { error: "I'm having a little trouble connecting. Please try again in a moment." },
      { status: 500 }
    );
  }
}
