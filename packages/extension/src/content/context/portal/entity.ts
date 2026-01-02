import { createContext } from "solid-js";

export type PortalInfo = {
  hover: DOMRect | null;
  selected: DOMRect[];
};

export type PortalActions = {
  setHover: (rect: DOMRect | null) => void;
  addSelected: (rect: DOMRect) => void;
  removeSelected: (index: number) => void;
  clearSelected: () => void;
};

export type PortalInfoContext = PortalActions;

export const DEFAULT_PORTAL_VALUE: PortalInfo = {
  hover: null,
  selected: [],
};

export const PortalContext = createContext<PortalInfoContext>({
  setHover: () => {},
  addSelected: () => {},
  removeSelected: () => {},
  clearSelected: () => {},
});
