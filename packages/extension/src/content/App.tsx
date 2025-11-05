import { css } from "solid-styled-components";
import { createSignal, onMount, onCleanup, createEffect, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { Emblem } from "./components/Emblem";
import { OptionChain } from "./components/OptionChain";

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
    // if (isActive()) {
    //   event.preventDefault();
    //   event.stopPropagation();

    //   const element = event.target as HTMLElement;
    //   console.log(element);

    //   setIsActive(false);
    // }
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
      chrome.runtime.sendMessage({ type: "echo", message: "Hello from content script" });
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
    <Presence exitBeforeEnter>
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
          <OptionChain />
        </Motion.div>
      </Show>
    </Presence>
  );
}
