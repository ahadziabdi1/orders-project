import {
  GoogleGenerativeAI,
  SchemaType,
  ResponseSchema,
} from "@google/generative-ai";

// Initialize using your key
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
  required: [
    "product_id",
    "customer_uuid",
    "quantity",
    "total_price",
    "address",
  ],
};

export async function POST(req: Request) {
  try {
    const { prompt, products, customers } = await req.json();

    const model = genAI.getGenerativeModel({
      // UPDATED: Using the exact model name from your list
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const aiPrompt = `
    Context:
    Products: ${JSON.stringify(products)}
    Customers: ${JSON.stringify(customers)}
    
    User Input: "${prompt}"
    
    Instructions:
    1. Carefully match the input to the 'name' in the Products and Customers lists.
    2. If the user mentions a product or customer that IS NOT in the lists above, 
       return "NOT_FOUND" for that specific ID field.
    3. DO NOT invent new IDs. Only use the provided 'id' or 'customer_uuid'.
    
    Output Format:
    Return ONLY a JSON object:
    {
      "product_id": "id or 'NOT_FOUND'",
      "customer_uuid": "uuid or 'NOT_FOUND'",
      "quantity": number,
      "total_price": number,
      "address": "string"
    }
  `;

    const result = await model.generateContent(aiPrompt);
    const text = result.response.text();
    const aiData = JSON.parse(text);

    return new Response(JSON.stringify({ object: aiData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("AI BACKEND ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
