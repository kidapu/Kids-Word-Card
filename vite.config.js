import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages（https://kidapu.github.io/Kids-Word-Card/）で配信するため
  base: "/Kids-Word-Card/",
  plugins: [react(), tailwindcss()],
});
