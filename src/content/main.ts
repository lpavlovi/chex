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
	shadow.appendChild(style);

	render(() => createComponent(App, {}), shadow);

	// extractCss function takes the styled components to build a CSS string
	// so this needs to be called after the render
	style.textContent = extractCss();
}

mountApp();
