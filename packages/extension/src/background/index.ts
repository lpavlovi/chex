import { log } from "./utils";
import { handleGoogleLogin } from "./logic/google_login";
import { handleByokLogin } from "./logic/byok_login";
import { useAiTool } from "./logic/ai";
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
    case "byok_login":
      log("BYOK Login requested");
      handleByokLogin(message, sendResponse);
      break;
    case "action":
      log("AI tool usage requested");
      useAiTool(message.contents, sendResponse);
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
