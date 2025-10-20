// Background script for Chrome extension
// This script runs in the background and can handle events, manage state, etc.

console.log('Background script loaded');

// Example: Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details);
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
  
  // SECURITY: Rate limiting check
  const senderId = sender.id || 'unknown';
  if (isRateLimited(senderId)) {
    console.warn('Rate limited message from sender:', senderId);
    sendResponse({ error: 'Rate limited' });
    return false;
  }
  
  // SECURITY: Validate message source
  if (!isValidSender(sender)) {
    console.warn('Rejected message from invalid sender:', sender);
    sendResponse({ error: 'Unauthorized' });
    return false;
  }
  
  // SECURITY: Validate message structure
  if (!isValidMessage(message)) {
    console.warn('Rejected invalid message structure:', message);
    sendResponse({ error: 'Invalid message format' });
    return false;
  }
  
  // CSRF Protection: Validate CSRF token for sensitive operations
  if (message.type === 'AUTH_TOKEN_EXCHANGE' || message.type === 'API_REQUEST') {
    if (!message.csrfToken || !validateCSRFToken(senderId, message.csrfToken)) {
      console.warn('Rejected message with invalid CSRF token:', senderId);
      sendResponse({ error: 'Invalid CSRF token' });
      return false;
    }
  }
  
  // Handle different message types here
  switch (message.type) {
    case 'GET_CSRF_TOKEN':
      handleCSRFTokenRequest(senderId, sendResponse);
      break;
    case 'AUTH_TOKEN_EXCHANGE':
      handleTokenExchange(message.token, sendResponse);
      break;
    case 'API_REQUEST':
      handleApiRequest(message.endpoint, message.data, sendResponse);
      break;
    case 'LOGOUT':
      handleLogout(sendResponse);
      break;
    default:
      console.log('Unknown message type:', message.type);
      sendResponse({ error: 'Unknown message type' });
  }
  
  return true; // Keep message channel open for async response
});

// SECURITY: Validate message sender with CSRF protection
function isValidSender(sender: chrome.runtime.MessageSender): boolean {
  // Must come from our extension
  if (sender.id !== chrome.runtime.id) {
    return false;
  }
  
  // Must have a valid origin (popup, content script, or extension page)
  if (!sender.origin && !sender.tab && !sender.url) {
    return false;
  }
  
  // CSRF Protection: Validate sender context
  if (sender.tab) {
    // Content scripts should have a specific origin pattern
    const isValidOrigin = (sender.origin?.startsWith('chrome-extension://') || 
                          sender.origin?.startsWith('https://') ||
                          sender.origin?.startsWith('http://')) ?? false;
    
    if (!isValidOrigin) return false;
    
    // Additional CSRF check: Validate tab URL is allowed
    if (sender.tab.url) {
      return isAllowedDomain(sender.tab.url);
    }
  }
  
  return true;
}

// CSRF Protection: Validate allowed domains for content scripts
function isAllowedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const allowedDomains = [
      'localhost',
      '127.0.0.1',
      // Add your trusted domains here
      // 'yourdomain.com',
      // 'api.yourdomain.com'
    ];
    
    // Allow localhost and 127.0.0.1 for development
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      return true;
    }
    
    // Check against allowed domains
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch (error) {
    console.warn('Invalid URL in CSRF check:', url);
    return false;
  }
}

// SECURITY: Validate message structure
function isValidMessage(message: any): boolean {
  // Must be an object
  if (typeof message !== 'object' || message === null) {
    return false;
  }
  
  // Must have a type
  if (typeof message.type !== 'string') {
    return false;
  }
  
  // Validate specific message types
  switch (message.type) {
    case 'GET_CSRF_TOKEN':
      return true; // No additional data needed
    case 'AUTH_TOKEN_EXCHANGE':
      return typeof message.token === 'string' && message.token.length > 0 &&
             typeof message.csrfToken === 'string';
    case 'API_REQUEST':
      return typeof message.endpoint === 'string' && 
             typeof message.data === 'object' &&
             typeof message.csrfToken === 'string';
    case 'LOGOUT':
      return true; // No additional data needed
    default:
      return false;
  }
}

// Example: Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
  }
});

// SECURITY: Handler functions for different message types
function handleCSRFTokenRequest(senderId: string, sendResponse: Function) {
  try {
    const token = generateCSRFToken(senderId);
    sendResponse({ success: true, csrfToken: token });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    sendResponse({ success: false, error: 'Failed to generate CSRF token' });
  }
}

async function handleTokenExchange(googleToken: string, sendResponse: Function) {
  try {
    // Validate token format
    if (!googleToken || typeof googleToken !== 'string') {
      sendResponse({ success: false, error: 'Invalid token format' });
      return;
    }

    // Make request to your API server
    const response = await fetch('http://localhost:3001/api/auth/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ googleToken }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const { jwt, expiresIn } = await response.json();

    // Store JWT securely
    await chrome.storage.local.set({
      jwt,
      expiresAt: Date.now() + (expiresIn * 1000),
      storedAt: Date.now(),
    });

    sendResponse({ success: true });
  } catch (error) {
    console.error('Token exchange error:', error);
    sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleApiRequest(endpoint: string, data: any, sendResponse: Function) {
  try {
    // Get stored JWT
    const { jwt, expiresAt } = await chrome.storage.local.get(['jwt', 'expiresAt']);
    
    if (!jwt) {
      sendResponse({ success: false, error: 'Not authenticated' });
      return;
    }

    // Check if token is expired
    if (expiresAt && Date.now() > expiresAt) {
      await chrome.storage.local.remove(['jwt', 'expiresAt']);
      sendResponse({ success: false, error: 'Token expired' });
      return;
    }

    // Make API request with JWT
    const response = await fetch(`http://localhost:3001/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    sendResponse({ success: response.ok, data: result });
  } catch (error) {
    console.error('API request error:', error);
    sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleLogout(sendResponse: Function) {
  try {
    // Clear all stored data
    await chrome.storage.local.clear();
    
    // Revoke Google token if possible
    try {
      await chrome.identity.clearAllCachedAuthTokens();
    } catch (error) {
      console.warn('Could not clear cached auth tokens:', error);
    }

    sendResponse({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// SECURITY: Additional protection - Rate limiting
const messageRateLimit = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_MESSAGES_PER_WINDOW = 10;

// CSRF Protection: Generate and validate CSRF tokens
const csrfTokens = new Map<string, { token: string; expires: number }>();
const CSRF_TOKEN_LIFETIME = 300000; // 5 minutes

function generateCSRFToken(senderId: string): string {
  const token = crypto.randomUUID();
  csrfTokens.set(senderId, {
    token,
    expires: Date.now() + CSRF_TOKEN_LIFETIME
  });
  return token;
}

function validateCSRFToken(senderId: string, token: string): boolean {
  const stored = csrfTokens.get(senderId);
  if (!stored) return false;
  
  // Check if token is expired
  if (Date.now() > stored.expires) {
    csrfTokens.delete(senderId);
    return false;
  }
  
  return stored.token === token;
}

// Clean up expired CSRF tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [senderId, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(senderId);
    }
  }
}, 60000); // Clean up every minute

function isRateLimited(senderId: string): boolean {
  const now = Date.now();
  const lastMessage = messageRateLimit.get(senderId) || 0;
  
  if (now - lastMessage < RATE_LIMIT_WINDOW) {
    const messageCount = (messageRateLimit.get(`${senderId}_count`) || 0) + 1;
    messageRateLimit.set(`${senderId}_count`, messageCount);
    
    if (messageCount > MAX_MESSAGES_PER_WINDOW) {
      return true;
    }
  } else {
    // Reset counter for new window
    messageRateLimit.set(`${senderId}_count`, 1);
  }
  
  messageRateLimit.set(senderId, now);
  return false;
}

// Export any functions that might be needed by other parts of the extension
export {};
