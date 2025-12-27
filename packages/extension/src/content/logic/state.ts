import { DOMElement } from "solid-js/jsx-runtime";

export const INACTIVE_STATE = { name: "INACTIVE" } as const;
export const IDLE_STATE = { name: "IDLE" } as const;
export const VISUAL_STATE = { name: "VISUAL" , selection: [] as any[] } as const;

export type InactiveState = typeof INACTIVE_STATE;
export type IdleState = typeof IDLE_STATE;
export type VisualState = typeof VISUAL_STATE;

export type State = InactiveState | IdleState | VisualState;

export type Action =
  | { type: "ACTIVATE" }
  | { type: "DEACTIVATE" }
  | { type: "VISUAL_MODE" }
  | {
      type: "ELEMENT_SELECT";
      element: DOMElement;
    };
