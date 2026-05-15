// @lovable.dev/vite-tanstack-config — cloudflare: false + nitro for Render (Node)
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [
    nitro({
      preset: "node-server",
    }),
  ],
});
