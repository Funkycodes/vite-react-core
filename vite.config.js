// vite.config.(js|ts)
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

export default defineConfig({
  root: "src",
  base: './',
  publicDir: '../static/',
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    host: true,
  },
  plugins: [
    react(),
    svgr()
  ],
});
