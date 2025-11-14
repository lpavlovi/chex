import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | undefined = undefined;

export function getGeminiInstance() {
  if (ai === undefined) {
    const apiKey = process.env.GEMINI_API_KEY;
    ai = new GoogleGenAI({apiKey});
  }
  return ai;
}