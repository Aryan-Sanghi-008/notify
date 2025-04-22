import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from 'fs';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: "copy-index-to-404",
      closeBundle: () => {
        const indexPath = "./dist/index.html";
        const errorPath = "./dist/404.html";
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, errorPath);
        }
      },
    },
  ],
  base: "/notify/",
});
