import { createSignal, Show, For } from "solid-js";
import { css } from "solid-styled-components";
import { Motion } from "solid-motionone";
import { useUserInfo } from "../context/user/hooks";
import { useCurrentView, useAppActions, useProcessingState, useSelectionState } from "../context/state/hooks";
import type { JSX } from "solid-js";
import type { ActionOption } from "../context/state/entity";

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
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #2a2a2a 0%, #404040 100%);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const containerClass = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const titleClass = css`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const loadingClass = css`
  color: #ffffff;
  font-size: 13px;
  text-align: center;
  padding: 20px;
`;

const resultClass = css`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  font-size: 13px;
  line-height: 1.4;
  max-width: 300px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

function Option({
  children,
  onClick,
  disabled = false,
}: {
  children?: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Motion.button
      class={optionButtonClass}
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, scale: 0.8, x: 80 }}
      animate={{ opacity: disabled ? 0.5 : 1, scale: 1, x: 0 }}
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

function MenuView() {
  const actions = useAppActions();

  const actionOptions: { key: ActionOption; label: string; icon: string }[] = [
    { key: "summarize", label: "Summarize", icon: "📝" },
    { key: "translate", label: "Translate", icon: "🌍" },
    { key: "speak", label: "Speak", icon: "🔊" },
  ];

  return (
    <div class={containerClass}>
      <For each={actionOptions}>
        {(action) => (
          <Option onClick={() => actions.selectAction(action.key)}>
            {action.icon} {action.label}
          </Option>
        )}
      </For>
      <Option onClick={actions.cancelSelection}>❌ Cancel</Option>
    </div>
  );
}

function ActionOptionsView() {
  const selectionState = useSelectionState();
  const actions = useAppActions();

  // For now, just handle translate options
  const languages = [
    { code: "en", name: "English" },
    { code: "de", name: "German" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "zh", name: "Chinese" },
  ];

  return (
    <div class={containerClass}>
      <div class={titleClass}>Translate to:</div>
      <For each={languages}>
        {(lang) => (
          <Option onClick={() => actions.startElementSelection()}>
            {lang.name}
          </Option>
        )}
      </For>
      <Option onClick={actions.cancelSelection}>← Back</Option>
    </div>
  );
}

function ElementSelectionView() {
  const actions = useAppActions();

  return (
    <div class={containerClass}>
      <div class={titleClass}>🎯 Select an element to process</div>
      <div class={loadingClass}>Hover over any element and click to select it</div>
      <Option onClick={actions.cancelSelection}>❌ Cancel</Option>
    </div>
  );
}

function ProcessingView() {
  const processingState = useProcessingState();

  const getProcessingText = () => {
    switch (processingState().step) {
      case "extracting":
        return "📄 Extracting content...";
      case "processing-action":
        return "🤖 Processing with AI...";
      case "generating-result":
        return "✨ Generating result...";
      default:
        return "⏳ Processing...";
    }
  };

  return (
    <div class={containerClass}>
      <div class={loadingClass}>{getProcessingText()}</div>
    </div>
  );
}

function ResultsView() {
  const processingState = useProcessingState();
  const selectionState = useSelectionState();
  const actions = useAppActions();

  const result = processingState().result;
  const error = processingState().error;
  const selectedAction = selectionState().selectedAction;

  return (
    <div class={containerClass}>
      <div class={titleClass}>
        {error ? "❌ Error" : `${selectedAction === "summarize" ? "📝" : selectedAction === "translate" ? "🌍" : "🔊"} Result`}
      </div>

      <div class={resultClass}>
        {error || result || "No result available"}
      </div>

      <Option onClick={() => actions.startElementSelection()}>
        🔄 Try another element
      </Option>
      <Option onClick={actions.goToMenu}>
        🏠 Back to menu
      </Option>
    </div>
  );
}

export function ChexCore() {
  const [userInfo, _] = useUserInfo();
  const currentView = useCurrentView();

  return (
    <Show when={userInfo()}>
      <div>
        <Show when={currentView() === "menu"}>
          <MenuView />
        </Show>

        <Show when={currentView() === "action-options"}>
          <ActionOptionsView />
        </Show>

        <Show when={currentView() === "element-selection"}>
          <ElementSelectionView />
        </Show>

        <Show when={currentView() === "processing"}>
          <ProcessingView />
        </Show>

        <Show when={currentView() === "results"}>
          <ResultsView />
        </Show>
      </div>
    </Show>
  );
}
