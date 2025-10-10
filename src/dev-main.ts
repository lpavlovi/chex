import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import { App } from "./content/App";
import { extractCss } from "solid-styled-components";

let styleElement: HTMLStyleElement | null = null;

function updateStyles() {
  const css = extractCss();
  if (styleElement) {
    styleElement.textContent = css;
  }
}

function mountDevApp() {
  const container = document.body;
  if (!container) {
    console.error("App container not found");
    return;
  }

  // Create and inject style element
  styleElement = document.createElement("style");
  styleElement.setAttribute("data-styled-components", "");
  document.head.appendChild(styleElement);

  // Initial render
  render(() => createComponent(App, {}), container);
  
  // Initial style extraction
  updateStyles();

  // Set up HMR for style updates
  if (import.meta.hot) {
    import.meta.hot.accept("./content/App", () => {
      // Re-extract styles when App component changes
      updateStyles();
    });
  }
}

// Auto-mount when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountDevApp);
  console.log("DOMContentLoaded");
} else {
  console.log("else mountDevApp");
  mountDevApp();
}

// Cleanup on unmount
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  });
}

console.log("dev-main.ts has been imported");