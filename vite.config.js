import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { mediaPlugin } from "./scripts/media-plugin.js";

export default defineConfig({
  plugins: [mediaPlugin(), reactRouter()],
  define: {
    "import.meta.env.VITE_NOINDEX": JSON.stringify(
      process.env.VERCEL_ENV === "preview" || process.env.SEO_NOINDEX === "1",
    ),
  },
});
