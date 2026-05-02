import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@logging": path.resolve(__dirname, "../logging_middleware/src"),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname), path.resolve(__dirname, "..")],
    },
  },
});

