import { css } from "solid-styled-components";
import { createSignal, onMount, onCleanup, createEffect, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { Emblem } from "./components/Emblem";
import { UserProvider } from "./context/user/provider";
import { ChexCore } from "./components/ChexCore";
import { Portal } from "solid-js/web";
import { PortalProvider } from "./context/portal/provider";

const CHROME_EXTENSION =
  typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id;

function sendEcho() {
  if (CHROME_EXTENSION) {
    return chrome.runtime.sendMessage({
      type: "echo",
      message: "Hello from content script",
    });
  } else {
    console.log({
      type: "echo",
      message: "Hello from content script",
    });
  }
}
const appContainerClass = css`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
`;

const detectMacOS: () => boolean = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMacOS = /macintosh|mac os x/.test(userAgent);
  return isMacOS;
};

export function App() {
  const [isActive, setIsActive] = createSignal(false);
  const [isMac, setIsMac] = createSignal(false);

  const handleClick = (event: MouseEvent) => {
    // TODO: Implement click handler
    return;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const isMacOS = isMac();
    const isCorrectKey = isMacOS
      ? event.metaKey && event.key === "k" // CMD + K on Mac
      : event.ctrlKey && event.key === "k"; // CTRL + K on Windows

    if (!isCorrectKey) {
      return;
    }
    event.preventDefault();
    setIsActive((prev) => !prev);
  };

  // Effect to manage click listener based on visibility
  createEffect(() => {
    if (isActive()) {
      document.addEventListener("click", handleClick, true);
      sendEcho();
    } else {
      document.removeEventListener("click", handleClick, true);
    }
  });

  onMount(() => {
    setIsMac(detectMacOS());
    document.addEventListener("keydown", handleKeyDown, true);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("click", handleClick, true);
  });

  return (
    <UserProvider>
      <PortalProvider>
        <Presence>
          <Show when={isActive()}>
            <Motion.div
              class={appContainerClass}
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{
                duration: 0.2,
                easing: "ease-out",
              }}
            >
              <Emblem isMac={isMac()} />
              <ChexCore />
            </Motion.div>
          </Show>
        </Presence>
      </PortalProvider>
    </UserProvider>
  );
}
