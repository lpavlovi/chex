import { log } from "../utils";
import type { ByokLoginMessage } from "../../shared/types/message";

type ByokLoginResponse = { success: true } | { success: false; error: any };

export async function handleByokLogin(
  message: ByokLoginMessage,
  sendResponse: (byokLoginResponse: ByokLoginResponse) => void,
) {
  try {
    // Store API key securely in chrome.storage.local
    await chrome.storage.local.set({
      apiKey: message.apiKey,
      apiKeySetAt: Date.now(),
    });

    log("API key stored successfully");
    sendResponse({ success: true });
  } catch (error) {
    log(`Error storing API key: ${error}`);
    sendResponse({ success: false, error: String(error) });
  }
}
