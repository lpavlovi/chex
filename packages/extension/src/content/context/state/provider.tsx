import { createStore } from "solid-js/store";
import { IDLE_STATE, AppStateContext } from "./entity";
import type { JSX } from "solid-js";
import type { Action, State } from "../../logic/state";

export function StateProvider(props: { children?: JSX.Element }) {
  const [state, setState] = createStore<State>(IDLE_STATE);

  function dispatch(action: Action) {
    switch (action.type) {
      case "ACTIVATE":
        setState(IDLE_STATE);
        return;
      case "DEACTIVATE":
        setState(IDLE_STATE);
        return;
      case "VISUAL_MODE":
        console.log("visual_mode");
        setState({ name: "VISUAL", selection: [] });
        return;
      case "ELEMENT_SELECT":
        if (state.name !== "VISUAL") {
          return;
        }

        return;
      default:
        console.log(`default - ${action} - what happened here?`);
        setState(IDLE_STATE);
        return
    }
  }

  return (
    <AppStateContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppStateContext.Provider>
  );
}

