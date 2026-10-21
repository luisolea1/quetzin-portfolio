import { projects, validateContent } from "./app/content/index.js";

export default {
  ssr: false,
  prerender() {
    validateContent();
    return ["/", "/work", "/about", ...projects.map(({ slug }) => `/projects/${slug}`)];
  },
};
