import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { crx } from "@crxjs/vite-plugin";
import zip from "vite-plugin-zip-pack";
import manifest from "./manifest.config";

const devBuild = process.env.NODE_ENV === "development";
const name = "chex";
const version = "0.1";
const isDevMode = process.env.DEV_MODE === "true";

export default defineConfig({
  plugins: [
    solid({ hot: true , ssr: true}),
    ...(isDevMode ? [] : [crx({ manifest })]),
    ...(devBuild
      ? []
      : [
          zip({ outDir: "release", outFileName: `crx-${name}-${version}.zip` }),
        ]),
  ],
  build: {
    sourcemap: devBuild,
  },
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
    port: isDevMode ? 3000 : 5173,
  },
});
