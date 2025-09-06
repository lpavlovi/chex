import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

const devBuild = process.env.NODE_ENV !== "development";
export default defineConfig({
	plugins: [solidPlugin()],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
		sourcemap: devBuild,
	},
});
