import { css } from "solid-styled-components";
import { useAppState } from "../context/state/hooks";
import { createMemo } from "solid-js";

// Base styling
const emblemContainerClass = css`
  width: 50px;
  height: 50px;
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

const visualClass = css`
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
`;

const processingClass = css`
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
`;

const errorClass = css`
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
`;

const successClass = css`
  background: linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%);
`;

const idleClass = css`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
`;

export const Emblem = (props: { isMac: boolean }) => {
  const [state] = useAppState();

  const stateClass = createMemo(() => {
    const stateName = state.name as string;
    switch (stateName) {
      case "VISUAL":
        return visualClass;
      case "PROCESSING":
        return processingClass;
      case "ERROR":
        return errorClass;
      case "SUCCESS":
        return successClass;
      default:
        return idleClass;
    }
  });

  return (
    <div class={`${emblemContainerClass} ${stateClass()}`}>
      {props.isMac ? "⌘ + K" : "Ctrl + K"}
    </div>
  );
};
