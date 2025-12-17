import { createStore } from "solid-js/store";
import { AppStateContext, DEFAULT_APP_STATE } from "./entity";
import type { JSX } from "solid-js";
import type { AppStateContextType } from "./entity";

export function StateProvider(props: { children?: JSX.Element }) {
  const [state, setState] = createStore(DEFAULT_APP_STATE);
  const appState: AppStateContextType = [state, setState];
  return (
    <AppStateContext.Provider value={appState}>
      {props.children}
    </AppStateContext.Provider>
  );
}

