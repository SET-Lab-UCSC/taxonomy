import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

const isCodeSandbox =
  "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default defineConfig({
  root: resolve(__dirname, "src"),
  publicDir: "../static/",
  base: "/taxonomy/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
      },
    },
  },
  server: {
    host: true,
    open: !isCodeSandbox,
  },
  plugins: [vue()],
});
