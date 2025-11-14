import { getGeminiInstance } from "./tools";

export async function summarize(textContent: string) {
  const ai = getGeminiInstance();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: textContent,
    config: {
      systemInstruction: "Please provide a concise summary of the text provided by the user.",
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    },
  });
  return response.text;
}
