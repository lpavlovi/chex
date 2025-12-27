import { createStore, produce } from "solid-js/store";
import { AppStateContext } from "./entity";
import type { JSX } from "solid-js";
import { type Action, type State } from "../../logic/state";

export function StateProvider(props: { children?: JSX.Element }) {
  const [state, setState] = createStore<State>({ name: "INACTIVE" });

  function dispatch(action: Action) {
    switch (action.type) {
      case "ACTIVATE":
        setState({ name: "IDLE" });
        return;
      case "DEACTIVATE":
        setState({ name: "INACTIVE" });
        return;
      case "VISUAL_MODE":
        setState({ name: "VISUAL", selection: [] });
        return;
      case "ELEMENT_SELECT":
        if (state.name !== "VISUAL") {
          return;
        }
        setState(
          produce((state: State) => {
            if (state.name === "VISUAL") {
              state.selection.push(action.element);
            }
          })
        );
        return;
      default:
        console.log(`default - ${action} - what happened here?`);
        setState({ name: "INACTIVE" });
        return;
    }
  }

  return (
    <AppStateContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppStateContext.Provider>
  );
}
