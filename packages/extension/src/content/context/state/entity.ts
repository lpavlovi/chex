import { createContext } from "solid-js";
import { Action, INACTIVE_STATE, State } from "../../logic/state";

type StateSetterType = (action: Action) => void;
function dispatchNoop(_action: Action) {}

export const AppStateContext = createContext<[State, StateSetterType]>([
  INACTIVE_STATE,
  dispatchNoop,
]);
