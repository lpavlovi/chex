import { createContext } from "solid-js";
import { Action, State } from "../../logic/state";

type StateSetterType = (action: Action) => void;

export const IDLE_STATE: State = { name: "IDLE" };

export const AppStateContext = createContext<[State, StateSetterType]>([
  IDLE_STATE,
  (_action: Action) => {},
]);
