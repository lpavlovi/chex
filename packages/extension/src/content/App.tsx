import { css } from "solid-styled-components";
import { createSignal, createMemo, onMount, onCleanup, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { Emblem } from "./components/Emblem";
import { UserProvider } from "./context/user/provider";
import { ChexCore } from "./components/ChexCore";
import { VisualMode } from "./components/VisualMode";
import { PortalProvider } from "./context/portal/provider";
import { StateProvider } from "./context/state/provider";
import { useAppState } from "./context/state/hooks";

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

function AppContent() {
  console.log("AppContent rendered");
  const [state, dispatch] = useAppState();
  const [isMac, setIsMac] = createSignal(false);

  // Derive isActive from state: active when not INACTIVE
  // Use createMemo to ensure reactivity tracking
  const isActive = createMemo(() => state.name !== "INACTIVE");

  const handleKeyDown = (event: KeyboardEvent) => {
    const isMacOS = isMac();
    const isCorrectKey = isMacOS
      ? event.metaKey && event.key === "k" // CMD + K on Mac
      : event.ctrlKey && event.key === "k"; // CTRL + K on Windows

    if (!isCorrectKey) {
      return;
    }
    event.preventDefault();
    
    if (isActive()) {
      dispatch({ type: "DEACTIVATE" });
    } else {
      dispatch({ type: "ACTIVATE" });
    }
  };

  onMount(() => {
    setIsMac(detectMacOS());
    document.addEventListener("keydown", handleKeyDown, true);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown, true);
  });

  return (
    <Presence>
      <Show when={isActive()}>
        <Motion.div
          class={appContainerClass}
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{
            duration: 0.1,
            easing: "ease-out",
          }}
        >
          <Emblem isMac={isMac()} />
          <ChexCore />
        </Motion.div>
      </Show>

      {/* Conditionally render VisualMode when in VISUAL state */}
      <Show when={state.name === "VISUAL"}>
        <VisualMode />
      </Show>
    </Presence>
  );
}

export function App() {
  return (
    <UserProvider>
      <StateProvider>
        <PortalProvider>
          <AppContent />
        </PortalProvider>
      </StateProvider>
    </UserProvider>
  );
}
