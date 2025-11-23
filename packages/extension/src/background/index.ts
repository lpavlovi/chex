import { log } from "./utils";
import { handleGoogleLogin } from "./handlers/google_login";
import { saveApiKeyHandler } from "./handlers/api_key";
import { handleAction } from "./handlers/actions";
import type { WorkerMessage } from "../shared/types/message";

function connectionHandler(port: chrome.runtime.Port) {
  log(`Connection established: ${port.name}`);
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
      handleAction(message.actions, message.contents, sendResponse);
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
