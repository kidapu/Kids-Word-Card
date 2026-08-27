import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const root = import.meta.dirname;

export default defineConfig({
  // GitHub Pages（https://kidapu.github.io/Kids-Word-Card/）で配信するため
  base: "/Kids-Word-Card/",
  plugins: [react(), tailwindcss()],
  build: {
    // アプリごとに別ページ。1つ増やすときはここに1行足す。
    rollupOptions: {
      input: {
        home:    resolve(root, "index.html"),
        cards:   resolve(root, "cards/index.html"),
        letters: resolve(root, "letters/index.html"),
        counting: resolve(root, "counting/index.html"),
        colors:   resolve(root, "colors/index.html"),
        maze:     resolve(root, "maze/index.html"),
      },
    },
  },
});
