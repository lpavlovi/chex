export function log(message: string) {
  console.log(
    `%c[BACKGROUND] %c${message}`,
    "color: blue; font-weight: bold;",
    "color: black; font-weight: normal;",
  );
}

export function saveApiKey(apiKey: string, modelId: string) {
    const localStoragePromise = chrome.storage.local.set({
      apiKey: apiKey,
      modelId: modelId,
      apiKeySetAt: Date.now(),
    });
    const sessionStoragePromise = chrome.storage.session.set({
      apiKey: apiKey,
      modelId: modelId,
      apiKeySetAt: Date.now(),
    });
    return Promise.allSettled([localStoragePromise, sessionStoragePromise]);
}