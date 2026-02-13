import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, tableData } = await req.json();

    // 🔹 Convert UI messages → ModelMessage[]
    const modelMessages = messages.map((m: any) => ({
      role: m.role as "user" | "assistant" | "system" | "tool",
      content: m.parts?.map((p: any) => p.text).join("") || "",
    }));

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      messages: modelMessages,
      system: `You are a data assistant. Analyze this data: ${JSON.stringify(
        tableData || []
      )}`,
    });

    // 🔹 Must use toUIMessageStreamResponse() for new useChat
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Error", { status: 500 });
  }
}
