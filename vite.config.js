// import glsl from "vite-plugin-glsl";
// import basicSsl from "@vitejs/plugin-basic-ssl";

import { defineConfig } from 'vite';
import { resolve } from 'path';

const isCodeSandbox =
  "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default {
  root: resolve(__dirname, 'src'),
  publicDir: "../static/",
  base: "https://set-lab-ucsc.github.io/taxonomy-web/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),   // include your main page
        tasks: resolve(__dirname, 'src/tasks.html'),
        explore: resolve(__dirname, 'src/explore.html'),
        applications: resolve(__dirname, 'src/applications.html'),
        environment: resolve(__dirname, 'src/environmental-change.html'),
        feedback: resolve(__dirname, 'src/feedback.html'),
        fruit: resolve(__dirname, 'src/fruit-ninja.html'),
        interface: resolve(__dirname, 'src/interface-elements.html'),
        csvtojson: resolve(__dirname, 'src/convertJSON.js'),
        intertech: resolve(__dirname, 'src/Interaction-techniques.html'),
        inputs: resolve(__dirname, 'src/inputs.html'),

      },
    },
  },
  server: {
    host: true,
    open: !isCodeSandbox,
  },
  plugins: [],
};
