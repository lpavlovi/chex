// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "path";

const devBuild = process.env.NODE_ENV === "development";

export default defineConfig({
	plugins: [solid()],
	build: {
		sourcemap: devBuild,
		rollupOptions: {
			// Define the entry points for your extension
			input: {
				popup: resolve(__dirname, "index.html"),
				content: resolve(__dirname, "src/content_script.tsx"),
			},
			output: {
				// Ensure files have a static name and are placed in the root of dist
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
			},
		},
	},
});
