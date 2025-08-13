import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/color-calc-vue",
  build: {
    outDir: "dist/color-calc-vue",
    assetsDir: "assets",
  },
});
