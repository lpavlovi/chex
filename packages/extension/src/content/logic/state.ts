import { DOMElement } from "solid-js/jsx-runtime";

export type IdleState = { name: "IDLE" };
export type VisualState = { name: "VISUAL"; selection: any[] };

export type State = IdleState | VisualState;

export type Action =
  | { type: "ACTIVATE" }
  | { type: "DEACTIVATE" }
  | { type: "VISUAL_MODE" }
  | {
      type: "ELEMENT_SELECT";
      element: DOMElement;
    };
