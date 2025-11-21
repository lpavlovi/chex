import { GoogleGenAI } from "@google/genai";
import { getApiKey } from "../storage/local";

let aiSingleton: GoogleGenAI | undefined = undefined;
let currentModelId: string | undefined = undefined;

async function getGeminiInstance() {
  const apiKeyData = await getApiKey();
  if (apiKeyData === null) {
    throw new Error("API key not found. Please set your API key first.");
  }

  // Recreate singleton if modelId changed or if it doesn't exist
  if (aiSingleton === undefined || currentModelId !== apiKeyData.modelId) {
    aiSingleton = new GoogleGenAI({ apiKey: apiKeyData.apiKey });
    currentModelId = apiKeyData.modelId;
  }
  return aiSingleton;
}

export async function generateContentFromGeminiFlashLite(contents: string): Promise<string | undefined> {
  const ai = await getGeminiInstance();
  const aiResult = await ai.models.generateContent({
    model: "gemini-2.5-flash-latest",
    contents: contents,
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });
  return aiResult.text;
}
