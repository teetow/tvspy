import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  build: {
    assetsDir: "./",
  },
  plugins: [react()],
  test: {
    globals: true,
  },
});
