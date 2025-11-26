import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { AppStateContext, DEFAULT_APP_STATE } from "./entity";
import type { AppStateContextType } from "./entity";

export function StateProvider(props: { children?: JSX.Element }) {
  const [value, setValue] = createSignal(DEFAULT_APP_STATE);
  const appState: AppStateContextType = [value, setValue];
  return (
    <AppStateContext.Provider value={appState}>
      {props.children}
    </AppStateContext.Provider>
  );
}

