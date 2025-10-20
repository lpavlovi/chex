// Background script for Chrome extension
// This script runs in the background and can handle events, manage state, etc.

console.log('Background script loaded');

// Example: Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details);
});

// Example: Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
  
  // Handle different message types here
  switch (message.type) {
    case 'example':
      // Handle example message
      sendResponse({ success: true });
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
  
  return true; // Keep message channel open for async response
});

// Example: Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
  }
});

// Export any functions that might be needed by other parts of the extension
export {};
