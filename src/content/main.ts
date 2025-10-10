import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import { App } from "./App";
import { extractCss } from "solid-styled-components";

/**
 * Mount the Solid app to the DOM.
 */
function mountApp() {
  // Create container and shadow root
  const container = document.createElement("div");
  container.id = "crxjs-app";
  document.body.appendChild(container);
  const shadow = container.attachShadow({ mode: "open" });

  // Create mount point inside shadow
  const mount = document.createElement("div");
  shadow.appendChild(mount);

  // Inject bundled CSS into shadow
  const style = document.createElement("style");
  style.setAttribute("data-styled-components", "");
  shadow.appendChild(style);

  // Initial render
  render(() => createComponent(App, {}), mount);

  // Initial style extraction
  style.textContent = extractCss();

  // For development: set up style updates on HMR
  if (import.meta.hot) {
    import.meta.hot.accept("./App", () => {
      // Re-extract and update styles in shadow DOM
      style.textContent = extractCss();
    });
  }
}

// Only mount if we're in extension context (not development mode)
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
  mountApp();
}
