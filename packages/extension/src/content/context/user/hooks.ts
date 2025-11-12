import { useContext } from "solid-js";
import { UserContext } from "./entity";

export function useUserInfo() {
  return useContext(UserContext);
}
