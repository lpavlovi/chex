import { createContext } from "solid-js";
import { nanoid } from "nanoid";

type StateOption =
  | "idle" // Ready for input
  | "listening" // Actively listening/ready for command
  | "processing" // Sending request to AI
  | "thinking" // AI is generating response
  | "responding" // Displaying AI response
  | "error" // Something went wrong
  | "loading"; // Initial loading/authentication

export type AppState = {
  current: StateOption;
  stateId: string;
  lastUpdated: number;
  error?: string;
  history: Array<{
    state: StateOption;
    stateId: string;
    timestamp: number;
    error?: string;
  }>;
};

// FSM State Transition Validation
const validTransitions: Record<StateOption, StateOption[]> = {
  idle: ["listening", "loading"],
  listening: ["idle", "processing"],
  processing: ["thinking", "error"],
  thinking: ["responding", "error"],
  responding: ["idle"],
  error: ["idle", "listening"],
  loading: ["idle", "listening", "error"],
};

export type AppStateFunctions = {
  transition: (nextState: StateOption, error?: string) => void;
  setIdle: () => void;
  setListening: () => void;
  setProcessing: () => void;
  setThinking: () => void;
  setResponding: () => void;
  setError: (error?: string) => void;
  setLoading: () => void;
  reset: () => void;
  canTransition: (from: StateOption, to: StateOption) => boolean;
  getStateHistory: () => AppState["history"];
};

export type AppStateContextType = [AppState, AppStateFunctions];

export const DEFAULT_APP_STATE: AppState = {
  current: "idle",
  stateId: nanoid(),
  lastUpdated: Date.now(),
  history: [],
};

export const AppStateContext = createContext<AppStateContextType>([
  DEFAULT_APP_STATE,
  {
    transition: () => {},
    setIdle: () => {},
    setListening: () => {},
    setProcessing: () => {},
    setThinking: () => {},
    setResponding: () => {},
    setError: () => {},
    setLoading: () => {},
    reset: () => {},
    canTransition: () => false,
    getStateHistory: () => [],
  },
]);
