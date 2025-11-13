import { LoginResults } from "../popup/login_utils";
import { log } from "./utils";

export async function handleGoogleLogin(sendResponse: (response: any) => void) {
  let res: LoginResults | null = null;

  try {
    // Use Chrome Identity API to get Google OAuth token
    log("Getting auth token");
    const tokenResult = await chrome.identity.getAuthToken({
      interactive: true,
    });
    const { token } = tokenResult;
    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    log("fetching info");
    // Get user info from Google API
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`,
    );
    const userInfo = await response.json();

    log("storing info");
    // Store credentials in chrome storage
    await chrome.storage.local.set({
      userEmail: userInfo.email,
      userName: userInfo.name,
      accessToken: token,
      loginTime: Date.now(),
    });
    log("login done");
    res = { success: true, userInfo: { name: userInfo.name } };
  } catch (error) {
    log("login error found");
    res = { success: false, error };
  }

  if (res == null) {
    log("login result null");
    return { success: false, error: "something went wrong" };
  }

  sendResponse(res);
}

export async function handleUserInfoRequest(
  sendResponse: (response: any) => void,
) {
  chrome.storage.local
    .get(["userEmail", "userName", "loginTime"])
    .then((result) =>
      sendResponse({
        userEmail: result.userEmail,
        userName: result.userName,
        loginTime: result.loginTime,
      }),
    )
    .catch((error) => {
      sendResponse({ success: false, error });
    });
}
