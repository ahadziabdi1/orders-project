import { GoogleGenerativeAI, SchemaType, ResponseSchema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const schema: ResponseSchema = {
  description: "Order extraction schema",
  type: SchemaType.OBJECT,
  properties: {
    product_id: { type: SchemaType.STRING },
    customer_uuid: { type: SchemaType.STRING },
    quantity: { type: SchemaType.NUMBER },
    total_price: { type: SchemaType.NUMBER },
    address: { type: SchemaType.STRING },
  },
  required: ["product_id", "customer_uuid", "quantity", "total_price", "address"],
};

export async function POST(req: Request) {
  try {
    const { prompt, products, customers } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Confirmed active model from your list
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const aiPrompt = `
      Context:
      Available Products: ${JSON.stringify(products)}
      Available Customers: ${JSON.stringify(customers)}
      
      User Input: "${prompt}"
      
      Instructions:
      1. Map the input to the 'name' in the Products and Customers lists provided.
      2. If the product or customer is not found in the lists, return the string "NOT_FOUND" for that specific ID field.
      3. Do not create new IDs; only use the provided 'id' or 'customer_uuid'.
      4. Default quantity is 1 if not specified. Calculate total_price as quantity * unit price.
    `;

    const result = await model.generateContent(aiPrompt);
    const text = result.response.text();
    const aiData = JSON.parse(text);

    return new Response(JSON.stringify({ object: aiData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("AI BACKEND ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}