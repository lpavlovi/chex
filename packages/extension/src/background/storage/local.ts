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

export function deleteApiKey() {
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
  return Promise.allSettled([localStoragePromise, sessionStoragePromise]);
}

export async function getApiKey(): Promise<{
  apiKey: string;
  modelId: string;
} | null> {
  // Try session storage first, then fall back to local storage
  const sessionData = await chrome.storage.session.get(["apiKey", "modelId"]);
  if (sessionData.apiKey && sessionData.modelId) {
    return { apiKey: sessionData.apiKey, modelId: sessionData.modelId } as {
      apiKey: string;
      modelId: string;
    };
  }

  const localData = await chrome.storage.local.get(["apiKey", "modelId"]);
  if (localData.apiKey && localData.modelId) {
    return { apiKey: localData.apiKey, modelId: localData.modelId } as {
      apiKey: string;
      modelId: string;
    };
  }

  return null;
}
