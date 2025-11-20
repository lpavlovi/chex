import { createContext } from "solid-js";
import type { Accessor, Setter } from "solid-js";

export type PortalInfo = DOMRect | null;

export type PortalInfoContext = [Accessor<PortalInfo>, Setter<PortalInfo>];

export const DEFAULT_PORTAL_VALUE: PortalInfo = null;

export const PortalContext = createContext<PortalInfoContext>([
  () => DEFAULT_PORTAL_VALUE,
  (v: any) => {},
]);
