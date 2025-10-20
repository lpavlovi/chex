import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Hello Extensions",
  version: "0.1",
  icons: {
    48: "public/hello_extensions.png",
  },
  action: {
    default_icon: {
      48: "public/hello_extensions.png",
    },
    default_popup: "index.html",
  },
  web_accessible_resources: [
    {
      resources: ["src/popup/main.ts"],
      matches: ["<all_urls>"],
    },
  ],
  background: {
    service_worker: "src/background/main.ts",
  },
  content_scripts: [
    {
      js: ["src/content/main.ts"],
      matches: ["https://*/*"],
    },
  ],
  permissions: ["activeTab", "contentSettings", "storage", "identity"],
  oauth2: {
    client_id:
      "566663842945-m74ug2jffp3moqfjkhao4aqg5s6vlggc.apps.googleusercontent.com",
    scopes: ["openid", "email", "profile"],
  },
});
