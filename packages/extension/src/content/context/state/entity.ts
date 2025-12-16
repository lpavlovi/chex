import { createContext } from "solid-js";
import type { Store, SetStoreFunction } from "solid-js/store";

type StateOption = "idle" | "listening";
export type AppState = { current: StateOption };

export type AppStateContextType = [Store<AppState>, SetStoreFunction<AppState>];

export const DEFAULT_APP_STATE: AppState = { current: "idle" };

export const AppStateContext = createContext<AppStateContextType>([
  DEFAULT_APP_STATE as Store<AppState>,
  (() => {}) as SetStoreFunction<AppState>,
]);

