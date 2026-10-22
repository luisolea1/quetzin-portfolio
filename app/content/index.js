import site from "./site.json" with { type: "json" };
import projects from "./projects.json" with { type: "json" };
import media from "./media.json" with { type: "json" };
import { validate } from "./validate.js";

export { site, projects, media };
export const validateContent = () => validate(site, projects, media);
export const findProject = (slug) => projects.find((project) => project.slug === slug);
export const getCarouselItems = (siteContent = site, mediaContent = media) =>
  siteContent.carousel.map((id) => ({
    ...mediaContent[id],
    id,
  }));
export const findRelated = (project) =>
  project.related.map((id) => projects.find((item) => item.id === id));
