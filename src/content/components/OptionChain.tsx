const OPTIONS = ["Summarize", "Translate", "Speak"];

import { css } from "solid-styled-components";
import { createSignal, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";

const optionClass = css`
  width: 100%;
  padding: 12px 6px;
  background: linear-gradient(135deg, #212121 0%, #383838 100%);
  border-radius: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  line-height: 1;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.18),
    0 2px 4px rgba(0, 0, 0, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
`;

function Option({ index, option, isVisible }: { index: number, option: string, isVisible: () => boolean }) {
  return (
    <Presence exitBeforeEnter>
      <Show when={isVisible()}>
        <Motion.div
          class={optionClass}
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          transition={{ 
            duration: 0.40, // Shorter duration for responsiveness
            delay: index * 0.15, // Shorter delay between options
            easing: "ease-out" 
          }}
        >
          {option}
        </Motion.div>
      </Show>
    </Presence>
  );
}

export const OptionChain = () => {
  // Always show options when this component is rendered (controlled by parent)
  const isShown = () => true;

  return (
    <div>
      {OPTIONS.map((option, index) => {
        return <Option index={index} option={option} isVisible={isShown} />
      })}
    </div>
  );
};