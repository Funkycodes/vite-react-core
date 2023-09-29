// vite.config.(js|ts)
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: './',
  publicDir: "static",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": require('path').resolve(__dirname, 'src'),
    }
  },
  server: {
    host: true,
  },
  plugins: [
    react(),
    svgr()
  ],
});
