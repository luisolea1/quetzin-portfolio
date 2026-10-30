import { projects, validateContent } from "./app/content/index.js";
import { getPagePaths } from "./app/content/paths.js";

export default {
  ssr: false,
  prerender() {
    validateContent();
    return [...getPagePaths(projects), "/404"];
  },
};
