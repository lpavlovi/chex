import { createStore, onCleanup, onMount, createEffect } from "solid-js/store";
import { AppStateContext, DEFAULT_APP_STATE } from "./entity";
import type { JSX } from "solid-js";
import type { AppStateContextType, ElementInfo } from "./entity";

export function StateProvider(props: { children?: JSX.Element }) {
  const [state, setState] = createStore(DEFAULT_APP_STATE);
  const appState: AppStateContextType = [state, setState];

  // Handle element selection and highlighting
  const handleMouseOver = (event: MouseEvent) => {
    if (!state.elementInteraction.isSelecting) return;

    const target = event.target as HTMLElement;
    if (target && target !== document.body) {
      const elementInfo: ElementInfo = {
        element: target,
        rect: target.getBoundingClientRect(),
        content: target.textContent || "",
        tagName: target.tagName.toLowerCase(),
        className: target.className,
        id: target.id,
      };
      setState("elementInteraction", "lastHighlightedElement", elementInfo);
      setState("elementInteraction", "isHovering", true);
    }
  };

  const handleMouseOut = (event: MouseEvent) => {
    if (!state.elementInteraction.isSelecting) return;
    setState("elementInteraction", "isHovering", false);
  };

  const handleElementClick = (event: MouseEvent) => {
    if (!state.elementInteraction.isSelecting) return;

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    if (target && target !== document.body) {
      const elementInfo: ElementInfo = {
        element: target,
        rect: target.getBoundingClientRect(),
        content: target.textContent || "",
        tagName: target.tagName.toLowerCase(),
        className: target.className,
        id: target.id,
      };

      // Select the element and start processing
      setState("selection", "selectedElement", elementInfo);
      setState("elementInteraction", "isSelecting", false);
      setState("ui", "currentView", "processing");
      setState("processing", "isProcessing", true);
      setState("processing", "step", "extracting");
      setState("processing", "result", null);
      setState("processing", "error", null);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && state.elementInteraction.isSelecting) {
      // Cancel element selection
      setState("ui", "currentView", "menu");
      setState("selection", "mode", "idle");
      setState("elementInteraction", "isSelecting", false);
      setState("elementInteraction", "lastHighlightedElement", null);
      setState("elementInteraction", "isHovering", false);
    }
  };

  // Add event listeners when in element selection mode
  createEffect(() => {
    const isSelecting = state.elementInteraction.isSelecting;

    if (isSelecting) {
      document.addEventListener("mouseover", handleMouseOver, true);
      document.addEventListener("mouseout", handleMouseOut, true);
      document.addEventListener("click", handleElementClick, true);
      document.addEventListener("keydown", handleKeyDown, true);
    } else {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
      document.removeEventListener("click", handleElementClick, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    }
  });

  // Cleanup on unmount
  onCleanup(() => {
    document.removeEventListener("mouseover", handleMouseOver, true);
    document.removeEventListener("mouseout", handleMouseOut, true);
    document.removeEventListener("click", handleElementClick, true);
    document.removeEventListener("keydown", handleKeyDown, true);
  });

  return (
    <AppStateContext.Provider value={appState}>
      {props.children}
    </AppStateContext.Provider>
  );
}

