import { css } from "solid-styled-components";
import { Motion } from "solid-motionone";
import { onCleanup } from "solid-js";
import { usePortal } from "../context/portal/hooks";
import { getClosestElementFromMouseEvent } from "../logic/capture";
import { getWorkerDispatcher } from "../../shared/worker_dispatcher";
import type { JSX, Setter } from "solid-js";
import type { WorkerDispatcher } from "../../shared/worker_dispatcher";
import type { ActionMessage } from "../../shared/types/message";

const optionButtonClass = css`
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
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  cursor: pointer;
`;

function Option({
  index,
  children,
  onClick,
}: {
  index: number;
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
        delay: index * 0.05,
        easing: "ease-out",
      }}
    >
      {children}
    </Motion.button>
  );
}

function SummarizeOption(props: {
  index: number;
  submitSummary: (summary: string) => void;
}) {
  const [_, setRect] = usePortal();
  function captureElementSelection(event: any) {
    event.preventDefault();

    const elementResult = getClosestElementFromMouseEvent(event);
    if (elementResult === null) {
      // nothing more to do
      return;
    }

    const [targetElement, textContents] = elementResult;
    setRect(targetElement.getBoundingClientRect());
    const d: WorkerDispatcher = getWorkerDispatcher();
    const m: ActionMessage = {
      type: "action",
      actions: [{ type: "summarize" }],
      contents: textContents,
    };
    d.sendMessage(m)
      .then((response) => {
        console.log(response);
        if (response.success && response.contents) {
          props.submitSummary(response.contents);
        } else if (!response.success && response.error) {
          props.submitSummary(response.error);
        } else {
          console.error("response from background script was wrong");
          props.submitSummary("Something went wrong");
        }
      })
      .catch((errorMessage: any) => {
        console.error(errorMessage);
      });

    document.removeEventListener("click", captureElementSelection, {
      capture: true,
    });
  }

  function summarizeCallback() {
    document.addEventListener("click", captureElementSelection, {
      capture: true,
    });
  }

  onCleanup(() => {
    document.removeEventListener("click", captureElementSelection, {
      capture: true,
    });
  });

  return (
    <Option index={props.index} onClick={summarizeCallback}>
      Summarize
    </Option>
  );
}

export const OptionChain = (props: {
  isLoggedIn: boolean;
  setInfo: Setter<string | null>;
}) => {
  const handleLoginClick = () => {
    console.log("Login clicked");
  };

  const handleSubmitSummary = (summary: string) => props.setInfo(summary);

  return (
    <div>
      {!props.isLoggedIn ? (
        <Option index={0} onClick={handleLoginClick}>
          Login
        </Option>
      ) : (
        <SummarizeOption index={0} submitSummary={handleSubmitSummary} />
      )}
    </div>
  );
};
