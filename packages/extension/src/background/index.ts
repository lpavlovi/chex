import { log, saveApiKey } from "./utils";
import { handleGoogleLogin } from "./logic/google_login";
import { useAiTool } from "./logic/ai";
import type {
  Action,
  SaveKeyMessage,
  WorkerMessage,
} from "../shared/types/message";

function connectionHandler(port: chrome.runtime.Port) {
  log(`Connection established: ${port.name}`);
}

async function deleteApiKeyHandler(
  message: any,
  sendResponse: (response: any) => void
) {
  try {
    const localStoragePromise = chrome.storage.local.remove([
      "apiKey",
      "modelId",
      "apiKeySetAt",
    ]);
    const sessionStoragePromise = chrome.storage.session.remove([
      "apiKey",
      "modelId",
      "apiKeySetAt",
    ]);

    await Promise.all([localStoragePromise, sessionStoragePromise]);

    log("API key removed successfully");
    sendResponse({ success: true });
  } catch (error) {
    log(`Error removing API key: ${error}`);
    sendResponse({ success: false, error: String(error) });
  }
}

async function saveApiKeyHandler(
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

function handleAction(
  actions: Action[],
  sendResponse: (response: any) => void
): void {
  // Only handles the "summarize" action
  const firstAction = actions.find((a) => a.type === "summarize");
  if (firstAction === undefined) {
    return sendResponse({ success: false, error: "No valid actions found" });
  }
  const aiToolPrompt = `Summarize the following contents.
Use as few sentences as neccessary.
It must use a maximum of 4 sentences.

${firstAction.contents}`.trimEnd();
  useAiTool(aiToolPrompt, sendResponse);
}

function messageHandler(
  message: WorkerMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) {
  switch (message.type) {
    case "echo":
      log(`Echo message: ${message.message}`);
      sendResponse({
        message: "Echo received",
        originalMessage: message.message,
      });
      break;
    case "save_key":
      saveApiKeyHandler(message, sendResponse);
      break;
    case "action":
      log("AI tool usage requested");
      handleAction(message.actions, sendResponse);
      break;
    case "google_login":
      log("Google Login requested");
      handleGoogleLogin(sendResponse);
      break;
    case "logout":
      log("Logout requested");
      sendResponse({ message: "Logout processed" });
      break;
    default:
      log("Unknown message type");
      sendResponse({ message: "Unknown message type" });
  }
  return true;
}

// Add event listeners
chrome.runtime.onConnect.addListener(connectionHandler);
chrome.runtime.onMessage.addListener(messageHandler);
