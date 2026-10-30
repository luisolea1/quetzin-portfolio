import site from "./site.json" with { type: "json" };
import projects from "./projects.json" with { type: "json" };
import originalMedia from "./media.json" with { type: "json" };
import assets from "../../.cache/media.json" with { type: "json" };
import { applyMediaVariants } from "./media-variants.js";
import { validate } from "./validate.js";

const media = applyMediaVariants(originalMedia, assets, {
  carouselIds: [...site.carousel, ...site.workCarousel],
});
export { site, projects, media };
export const validateContent = () => validate(site, projects, media);
export const findProject = (slug) => projects.find((project) => project.slug === slug);
export const findLegacyProject = (slug) =>
  projects.find((project) => project.legacySlugs?.includes(slug));
const resolveCarouselItems = (ids, mediaContent) =>
  ids.map((id) => ({
    ...mediaContent[id],
    id,
  }));
export const getCarouselItems = (siteContent = site, mediaContent = media) =>
  resolveCarouselItems(siteContent.carousel, mediaContent);
export const getWorkCarouselItems = (siteContent = site, mediaContent = media) =>
  resolveCarouselItems(siteContent.workCarousel, mediaContent);
export const findRelated = (project) =>
  project.related.map((id) => projects.find((item) => item.id === id));
