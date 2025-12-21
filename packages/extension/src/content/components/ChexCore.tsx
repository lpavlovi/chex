import { createSignal } from "solid-js";
import { css } from "solid-styled-components";
import { Motion } from "solid-motionone";
import { useUserInfo } from "../context/user/hooks";
import type { JSX } from "solid-js";

const optionButtonClass = css`
  width: 100%;
  padding: 18px 6px;
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
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  cursor: pointer;
`;

function Option({
  children,
  onClick,
}: {
  children?: JSX.Element;
  onClick?: () => void;
}) {
  return (
    <Motion.button
      class={optionButtonClass}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8, x: 80 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 80 }}
      transition={{
        duration: 0.2,
        easing: "ease-out",
      }}
    >
      {children}
    </Motion.button>
  );
}

export function ChexCore() {
  const [userInfo, _] = useUserInfo();
  return (
    <>
      <div>
        <Option>choose</Option>
      </div>
    </>
  );
}
