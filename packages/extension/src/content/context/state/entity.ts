import { createContext } from "solid-js";
import type { Store, SetStoreFunction } from "solid-js/store";

// Element information for selected DOM elements
export interface ElementInfo {
  element: HTMLElement;
  rect: DOMRect;
  content: string;
  tagName: string;
  className: string;
  id: string;
}

// Action options available to users
export type ActionOption = "summarize" | "translate" | "speak";

// Processing steps for AI actions
export type ProcessingStep = "idle" | "extracting" | "processing-action" | "generating-result";

// UI view states
export type ViewState = "menu" | "action-options" | "element-selection" | "processing" | "results";

// Selection workflow states
export type SelectionMode = "idle" | "action-selection" | "element-selection" | "processing" | "completed";

// Comprehensive application state
export interface AppState {
  // UI view management (separate from App.tsx visibility)
  ui: {
    currentView: ViewState;
  };

  // Selection workflow state
  selection: {
    mode: SelectionMode;
    selectedAction: ActionOption | null;
    selectedElement: ElementInfo | null;
  };

  // Content processing state
  processing: {
    isProcessing: boolean;
    step: ProcessingStep;
    result: string | null;
    error: string | null;
  };

  // Element interaction state for highlighting
  elementInteraction: {
    isHovering: boolean;
    isSelecting: boolean;
    lastHighlightedElement: ElementInfo | null;
  };
}

export type AppStateContextType = [Store<AppState>, SetStoreFunction<AppState>];

// Default state initialization
export const DEFAULT_APP_STATE: AppState = {
  ui: {
    currentView: "menu",
  },
  selection: {
    mode: "idle",
    selectedAction: null,
    selectedElement: null,
  },
  processing: {
    isProcessing: false,
    step: "idle",
    result: null,
    error: null,
  },
  elementInteraction: {
    isHovering: false,
    isSelecting: false,
    lastHighlightedElement: null,
  },
};

export const AppStateContext = createContext<AppStateContextType>([
  DEFAULT_APP_STATE as Store<AppState>,
  (() => {}) as SetStoreFunction<AppState>,
]);

