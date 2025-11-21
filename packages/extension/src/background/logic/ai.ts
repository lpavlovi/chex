import { GoogleGenAI } from "@google/genai";
import { getApiKey } from "../storage/local";

let aiSingleton: GoogleGenAI | undefined = undefined;
let currentModelId: string | undefined = undefined;

export async function getGeminiInstance() {
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

export async function useAiTool(
  textContents: string,
  sendResponse: (response: any) => void,
): Promise<any> {
  try {
    const ai = await getGeminiInstance();
    
    if (currentModelId === undefined) {
      return sendResponse({ success: false, error: "API key not found" });
    }

    ai.models
      .generateContent({
        model: currentModelId,
        contents: textContents,
        config: {
          thinkingConfig: {
            thinkingBudget: 0, // Disables thinking
          },
        },
      })
      .then((response) => {
        sendResponse({ success: true, response: response.text });
      })
      .catch((e) => sendResponse({ success: false, error: String(e) }));
  } catch (error) {
    sendResponse({ success: false, error: String(error) });
  }
}
