import { css } from "solid-styled-components";
import { useAppState } from "../context/state/hooks";
import { createMemo } from "solid-js";

// Base styling with dynamic background
const emblemContainerClass = (bgGradient: string) => css`
  width: 50px;
  height: 50px;
  background: ${bgGradient};
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

// Function to determine background based on state
const getBackgroundForState = (stateName: string): string => {
  switch (stateName) {
    case "VISUAL":
      return "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)";
    case "PROCESSING":
      return "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)";
    case "ERROR":
      return "linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)";
    case "SUCCESS":
      return "linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)";
    default:
      return "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)";
  }
};

export const Emblem = (props: { isMac: boolean }) => {
  const [state, dispatch] = useAppState();
  const background = createMemo(() => getBackgroundForState(state.name));

  return (
    <div class={emblemContainerClass(background())}>
      {props.isMac ? "⌘ + K" : "Ctrl + K"}
    </div>
  );
};
