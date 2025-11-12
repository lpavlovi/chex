import { log } from "./utils";
import { handleGoogleLogin, handleUserInfoRequest } from "./login";
import type { ExtensionMessage } from "@chex/shared";

// Define the handlers
function connectionHandler(port: chrome.runtime.Port) {
	log(`Connection established: ${port.name}`);
}

function messageHandler(
	message: ExtensionMessage,
	sender: chrome.runtime.MessageSender,
	sendResponse: (response: any) => void,
) {
	// Handle different message types
	switch (message.type) {
		case "echo":
			log(`Echo message: ${message.message}`);
			sendResponse({
				message: "Echo received",
				originalMessage: message.message,
			});
			break;
		case "login":
			log("Login requested");
			handleGoogleLogin(sendResponse);
			break;
		case "userInfo":
			log("User Info requested");
			handleUserInfoRequest(sendResponse);
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
