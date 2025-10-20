import { createSignal, createEffect } from "solid-js";
import { css } from "solid-styled-components";

const containerClass = css`
  width: 300px;
  padding: 20px;
  background: white;
  color: black;
`;
const titleClass = css`
  margin: 0 0 20px 0;
  font-size: 18px;
`;
const buttonClass = css`
  width: 100%;
  padding: 10px;
  background: black;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const statusClass = css`
  margin-top: 15px;
  font-size: 12px;
`;

interface LoginPopupProps {
  onLogin?: (token: string) => void;
}

export function LoginPopup(props: LoginPopupProps) {
  const [isLoading, setIsLoading] = createSignal(false);
  const [status, setStatus] = createSignal("");
  const [isError, setIsError] = createSignal(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setStatus("Signing in with Google...");
    setIsError(false);

    try {
      // Use Chrome Identity API to get Google OAuth token
      const tokenResult = await chrome.identity.getAuthToken({
        interactive: true,
      });
      const { token } = tokenResult;
      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      // Get user info from Google API
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`,
      );
      const userInfo = await response.json();
      console.log(userInfo);

      // Call the login handler if provided
      if (props.onLogin) {
        props.onLogin(token);
      }

      setStatus(`Welcome, ${userInfo.email}!`);
      setIsError(false);

      // Store credentials in chrome storage
      await chrome.storage.local.set({
        userEmail: userInfo.email,
        userName: userInfo.name,
        accessToken: token,
        isLoggedIn: true,
        loginTime: Date.now(),
      });
    } catch (error) {
      console.error("Google login error:", error);
      setStatus("Sign-in failed. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already logged in
  createEffect(async () => {
    console.log("Checking login status");
    try {
      const result = await chrome.storage.local.get([
        "isLoggedIn",
        "userEmail",
      ]);
      if (result.isLoggedIn && result.userEmail) {
        setStatus(`Welcome back, ${result.userEmail}!`);
        setIsError(false);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  });

  return (
    <div class={containerClass}>
      <h1 class={titleClass}>Sign In</h1>

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading()}
        class={buttonClass}
      >
        {isLoading() ? "Signing in..." : "Sign in with Google"}
      </button>

      <div class={`${statusClass} color: ${isError() ? "red" : "green"};`}>
        {status()}
      </div>
    </div>
  );
}
