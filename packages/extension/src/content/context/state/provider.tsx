import { createStore } from "solid-js/store";
import { DEFAULT_APP_STATE, AppStateContext } from "./entity";
import type { JSX } from "solid-js";
import type { AppStateContextType, AppStateFunctions } from "./entity";

export function StateProvider(props: { children?: JSX.Element }) {
  const [state, setState] = createStore(DEFAULT_APP_STATE);

  const stateFunctions: AppStateFunctions = {
    setIdle() {
      setState("current", "idle");
    },
    setListening() {
      setState("current", "listening");
    },
    setProcessing() {
      setState("current", "processing");
    },
    setThinking() {
      setState("current", "thinking");
    },
    setResponding() {
      setState("current", "responding");
    },
    setError() {
      setState("current", "error");
    },
    setLoading() {
      setState("current", "loading");
    },
    reset() {
      setState("current", "idle");
    },
  };

  const appState: AppStateContextType = [state, stateFunctions];

  return (
    <AppStateContext.Provider value={appState}>
      {props.children}
    </AppStateContext.Provider>
  );
}

