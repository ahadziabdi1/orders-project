import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 30;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("Fetching full dataset for AI analysis...");
    const { data: allOrders, error } = await supabase
      .from("orders")
      .select("*");

    if (error) {
      console.error("Supabase error:", error);
    }

    const modelMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.parts?.map((p: any) => p.text).join("") || m.content || "",
    }));

    const result = await streamText({
      model: google("gemini-2.5-flash") as any,
      messages: modelMessages,
      system: `You are an expert data analyst for an Orders Management system.
      
      Below is the COMPLETE dataset from the database. Use this to answer the user.
      If the user asks for trends, totals, or specific orders, calculate them from this data.
      
      DATASET:
      ${JSON.stringify(allOrders || [], null, 2)}
      
      Rules:
      - Answer ONLY based on the provided dataset.
      - Use bullet points for readability.
      - Be concise and professional.`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Internal Server Error:", error);
    return new Response("Error", { status: 500 });
  }
}
