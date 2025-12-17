import { useContext, createMemo } from "solid-js";
import { AppStateContext } from "./entity";
import type {
  AppState,
  SetStoreFunction,
  ActionOption,
  ProcessingStep,
  ViewState,
  SelectionMode,
  ElementInfo
} from "./entity";

export function useAppState() {
  return useContext(AppStateContext);
}

/**
 * Creates element information from a DOM element
 */
function createElementInfo(element: HTMLElement): ElementInfo {
  return {
    element,
    rect: element.getBoundingClientRect(),
    content: element.textContent || "",
    tagName: element.tagName.toLowerCase(),
    className: element.className,
    id: element.id,
  };
}

/**
 * Action creators for state manipulation
 */
export function useAppActions() {
  const [, setState] = useAppState();

  return {
    // Selection workflow actions
    startActionSelection: () => {
      setState("ui", "currentView", "menu");
      setState("selection", "mode", "action-selection");
      setState("selection", "selectedAction", null);
      setState("selection", "selectedElement", null);
    },

    selectAction: (action: ActionOption) => {
      setState("selection", "selectedAction", action);
      if (action === "translate") {
        setState("ui", "currentView", "action-options");
      } else {
        // Direct to element selection for summarize and speak
        startElementSelection();
      }
    },

    startElementSelection: () => {
      setState("ui", "currentView", "element-selection");
      setState("selection", "mode", "element-selection");
      setState("elementInteraction", "isSelecting", true);
    },

    selectElement: (element: HTMLElement) => {
      const elementInfo = createElementInfo(element);
      setState("selection", "selectedElement", elementInfo);
      setState("elementInteraction", "isSelecting", false);
      setState("elementInteraction", "lastHighlightedElement", elementInfo);
      startProcessing();
    },

    cancelSelection: () => {
      setState("ui", "currentView", "menu");
      setState("selection", "mode", "idle");
      setState("selection", "selectedAction", null);
      setState("selection", "selectedElement", null);
      setState("elementInteraction", "isSelecting", false);
      setState("elementInteraction", "lastHighlightedElement", null);
    },

    resetSelection: () => {
      setState("selection", "mode", "idle");
      setState("selection", "selectedAction", null);
      setState("selection", "selectedElement", null);
    },

    // Processing actions
    startProcessing: () => {
      setState("ui", "currentView", "processing");
      setState("processing", "isProcessing", true);
      setState("processing", "step", "extracting");
      setState("processing", "result", null);
      setState("processing", "error", null);
    },

    setProcessingStep: (step: ProcessingStep) => {
      setState("processing", "step", step);
    },

    setResult: (result: string) => {
      setState("processing", "result", result);
      setState("processing", "isProcessing", false);
      setState("ui", "currentView", "results");
    },

    setError: (error: string) => {
      setState("processing", "error", error);
      setState("processing", "isProcessing", false);
      setState("ui", "currentView", "results");
    },

    resetProcessing: () => {
      setState("processing", "isProcessing", false);
      setState("processing", "step", "idle");
      setState("processing", "result", null);
      setState("processing", "error", null);
    },

    // Element interaction actions
    highlightElement: (element: HTMLElement) => {
      const elementInfo = createElementInfo(element);
      setState("elementInteraction", "lastHighlightedElement", elementInfo);
    },

    clearHighlights: () => {
      setState("elementInteraction", "lastHighlightedElement", null);
      setState("elementInteraction", "isHovering", false);
    },

    setHoverState: (isHovering: boolean) => {
      setState("elementInteraction", "isHovering", isHovering);
    },

    setSelectingState: (isSelecting: boolean) => {
      setState("elementInteraction", "isSelecting", isSelecting);
    },

    // General navigation
    goToMenu: () => {
      setState("ui", "currentView", "menu");
      resetAllStates();
    },
  };

  function resetAllStates() {
    setState("selection", "mode", "idle");
    setState("selection", "selectedAction", null);
    setState("selection", "selectedElement", null);
    setState("processing", "isProcessing", false);
    setState("processing", "step", "idle");
    setState("processing", "result", null);
    setState("processing", "error", null);
    setState("elementInteraction", "isHovering", false);
    setState("elementInteraction", "isSelecting", false);
    setState("elementInteraction", "lastHighlightedElement", null);
  }

  function startProcessing() {
    setState("ui", "currentView", "processing");
    setState("processing", "isProcessing", true);
    setState("processing", "step", "extracting");
    setState("processing", "result", null);
    setState("processing", "error", null);
  }
}

/**
 * Specialized selectors for easier component usage
 */
export function useSelectionState() {
  const [state] = useAppState();
  return createMemo(() => state.selection);
}

export function useProcessingState() {
  const [state] = useAppState();
  return createMemo(() => state.processing);
}

export function useElementInteraction() {
  const [state] = useAppState();
  return createMemo(() => state.elementInteraction);
}

export function useCurrentView() {
  const [state] = useAppState();
  return createMemo(() => state.ui.currentView);
}

