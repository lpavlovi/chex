import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
	manifest_version: 3,
	name: "Hello Extensions",
	version: "1.0",
	icons: {
		48: "public/hello_extensions.png",
	},
	action: {
		default_icon: {
			48: "public/hello_extensions.png",
		},
		default_popup: "src/popup/index.html",
	},
	content_scripts: [
		{
			js: ["src/content/main.ts"],
			matches: ["https://*/*"],
		},
	],
	permissions: ["sidePanel", "contentSettings"],
	side_panel: {
		default_path: "src/sidepanel/index.html",
	},
});
