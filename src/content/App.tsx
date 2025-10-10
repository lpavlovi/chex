import { styled, css } from "solid-styled-components";
import { createSignal, onMount, onCleanup, createEffect } from "solid-js";
import { clsx } from "clsx";

const AppContainer = styled("div")`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  z-index: 9999;
`;

const hiddenClass = css`
  visibility: hidden;
`;

const EmblemContainer = styled("div")`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  line-height: 1;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.25),
    0 4px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Emblem = (props: { visible: boolean; isMac: boolean }) => {
  return (
    <EmblemContainer class={clsx(!props.visible && hiddenClass)}>
      {props.isMac ? "⌘ + K" : "Ctrl + K"}
    </EmblemContainer>
  );
};

const detectMacOS: () => boolean = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMacOS = /macintosh|mac os x/.test(userAgent);
  return isMacOS;
};

export function App() {
  const [isActive, setIsActive] = createSignal(false);
  const [isMac, setIsMac] = createSignal(false);

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
      event.preventDefault();
      setIsActive((prev) => !prev);
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
    <AppContainer>
      <Emblem visible={isActive()} isMac={isMac()} />
    </AppContainer>
  );
}
