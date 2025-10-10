import { styled , css} from "solid-styled-components";
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
  const [lastToggleTime, setLastToggleTime] = createSignal(0);
  const [animationControls, setAnimationControls] = createSignal<any>();

  const handleClick = (event: MouseEvent) => {
    if (isActive()) {
      event.preventDefault();
      event.stopPropagation();

      const element = event.target as HTMLElement;
      console.log(element);

      setIsActive(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const isMacOS = isMac();
    const isCorrectKey = isMacOS
      ? event.metaKey && event.key === "k" // CMD + K on Mac
      : event.ctrlKey && event.key === "k"; // CTRL + K on Windows

    if (isCorrectKey) {
      console.log("handleKeyDown correct key");
      event.preventDefault();
      
      const now = Date.now();
      const timeSinceLastToggle = now - lastToggleTime();
      
      // If pressed within 100ms of last toggle, stop current animation and toggle immediately
      if (timeSinceLastToggle < 100) {
        console.log("Rapid key press detected - interrupting animation");
        const controls = animationControls();
        if (controls) {
          controls.stop(); // Stop current animation
        }
      }
      
      setIsActive((prev) => !prev);
      setLastToggleTime(now);
    }
  };

  // Effect to manage click listener based on visibility
  createEffect(() => {
    if (isActive()) {
      document.addEventListener("click", handleClick, true);
    } else {
      document.removeEventListener("click", handleClick, true);
    }
  });

  onMount(() => {
    setIsMac(detectMacOS());
    document.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown);
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
            duration: 0.2, // Shorter duration for more responsive feel
            easing: "ease-out" 
          }}
          ref={(controls) => setAnimationControls(controls)}
        >
          <Emblem isMac={isMac()} />
          <OptionChain />
        </Motion.div>
      </Show>
    </Presence>
  );
}
