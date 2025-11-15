import { useContext } from "solid-js";
import { PortalContext } from "./entity";

export function usePortal() {
  return useContext(PortalContext);
}
