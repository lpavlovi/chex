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
    console.log("handleGoogleLogin");
    const googleLoginResult = await chrome.runtime.sendMessage({ type: "login" });
    console.log(googleLoginResult);
  };

  // Check if user is already logged in
  createEffect(async () => {
    const userInfoResult = await chrome.runtime.sendMessage({ type: "userInfo" });
    console.log(userInfoResult);
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
