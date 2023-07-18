// vite.config.(js|ts)
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import { nodePolyfills } from "vite-plugin-node-polyfills";

const options = { pretty: true }; // FIXME: pug pretty is deprecated!

export default defineConfig(async ({ mode, command }) => {
  return {
    root: "src",
    base: './',
    build: {
      outDir: "../dist",
    },
    server: {
      host: true,
    },
    plugins: [
      nodePolyfills({
        // To exclude specific polyfills, add them to this list.
        exclude: [],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
        // Whether to polyfill `node:` protocol imports.
      }),
      react()
    ],
  };
});
