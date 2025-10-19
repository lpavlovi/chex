import { css } from "solid-styled-components";

const emblemContainerClass = css`
  width: 50px;
  height: 50px;
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

export const Emblem = (props: { isMac: boolean }) => {
  return (
    <div class={emblemContainerClass}>{props.isMac ? "⌘ + K" : "Ctrl + K"}</div>
  );
};
