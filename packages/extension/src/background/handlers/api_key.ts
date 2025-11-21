import { log } from "../utils";
import { deleteApiKey, saveApiKey } from "../storage/local";
import type { SaveKeyMessage } from "../../shared/types/message";

export async function deleteApiKeyHandler(
  sendResponse: (response: any) => void
) {
  try {
    await deleteApiKey();
    sendResponse({ success: true });
  } catch (error) {
    log(`Error removing API key: ${error}`);
    sendResponse({ success: false, error: String(error) });
  }
}

export async function saveApiKeyHandler(
  message: SaveKeyMessage,
  sendResponse: (response: any) => void
) {
  try {
    await saveApiKey(message.apiKey, message.modelId);
    sendResponse({ success: true });
  } catch (error) {
    log(`Error storing API key: ${error}`);
    sendResponse({ success: false, error: String(error) });
  }
}

