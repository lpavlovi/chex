import { createContext } from "solid-js";
import type { Accessor, Setter } from "solid-js";

type StateOption = "idle" | "listening";
export type AppState = {current: StateOption};

export type AppStateContextType = [Accessor<AppState>, Setter<AppState>];

export const DEFAULT_APP_STATE: AppState = {current: "idle"};

export const AppStateContext = createContext<AppStateContextType>([
  () => DEFAULT_APP_STATE,
  (_v: AppState | ((prev: AppState) => AppState)) => {},
]);

