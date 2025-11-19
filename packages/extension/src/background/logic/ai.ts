import { GoogleGenAI } from "@google/genai";

let aiSingleton: GoogleGenAI | undefined = undefined;

export function getGeminiInstance() {
  if (aiSingleton === undefined) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiSingleton = new GoogleGenAI({ apiKey });
  }
  return aiSingleton;
}

export async function useAiTool(
  textContents: string,
  sendResponse: (response: any) => void
): Promise<any> {
  const ai = getGeminiInstance();

  ai.models
    .generateContent({
      model: "gemini-2.5-flash-light",
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
    .catch((e) => sendResponse({ success: true, error: e }));
}
