import { onMount, onCleanup } from "solid-js";
import { useAppState } from "../context/state/hooks";
import { usePortal } from "../context/portal/hooks";
import { getClosestElementFromMouseEvent } from "../logic/capture";

export function VisualMode() {
  const [state, dispatch] = useAppState();
  const [portalInfo, setPortalInfo] = usePortal();

  function handleElementClick(event: MouseEvent) {
    console.log("handleElementClick");
    // Only process if we're in VISUAL state
    if (state.name !== "VISUAL") return;

    // Capture the element using existing utility
    const result = getClosestElementFromMouseEvent(event);

    if (result) {

      const [element, _textContent] = result;

      // Dispatch action to add element to selection
      dispatch({ type: "ELEMENT_SELECT", element: element });

      // Optional: Update portal to show highlight
      const rect = element.getBoundingClientRect();
      setPortalInfo(rect);

      // Optional: Prevent default behavior
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onMount(() => {
    // Add click listener to document (use capture phase)
    document.addEventListener("click", handleElementClick, true);
  });

  onCleanup(() => {
    // Remove click listener
    document.removeEventListener("click", handleElementClick, true);
  });

  // This component renders nothing - purely for lifecycle management
  return null;
}
