import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { crx } from "@crxjs/vite-plugin";
import zip from "vite-plugin-zip-pack";
import manifest from "./manifest.config";

const devBuild = process.env.NODE_ENV === "development";
const name = "chex";
const version = "0.1";

export default defineConfig({
	plugins: [
		solid(),
		crx({ manifest }),
		zip({ outDir: "release", outFileName: `crx-${name}-${version}.zip` }),
	],
	build: {
		sourcemap: devBuild,
	},
	server: {
		cors: {
			origin: [/chrome-extension:\/\//],
		},
	},
});
