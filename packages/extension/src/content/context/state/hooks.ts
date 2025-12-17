import { useContext } from "solid-js";
import { AppStateContext } from "./entity";

export function useAppState() {
  return useContext(AppStateContext);
}

