import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import { LoginPopup } from "./LoginPopup";
import { extractCss } from "solid-styled-components";

let styleElement: HTMLStyleElement | null = null;

function updateStyles() {
  const css = extractCss();
  if (styleElement) {
    styleElement.textContent = css;
  }
}

function mountPopupApp() {
  const container = document.getElementById("app");
  if (!container) {
    console.error("Popup app container not found");
    return;
  }

  // Create and inject style element
  styleElement = document.createElement("style");
  styleElement.setAttribute("data-styled-components", "");
  document.head.appendChild(styleElement);

  // Initial render
  render(() => createComponent(LoginPopup, { }), container);

  // Initial style extraction
  updateStyles();
}

// Auto-mount when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountPopupApp);
} else {
  mountPopupApp();
}
