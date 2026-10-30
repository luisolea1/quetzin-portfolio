export const getPagePaths = (projects) => [
  "/",
  "/work",
  "/about",
  ...projects.map(({ slug }) => `/projects/${slug}`),
];

export const getLegacyRedirects = (projects) =>
  projects.flatMap(({ slug, legacySlugs = [] }) =>
    legacySlugs.map((legacy) => ({ from: `/projects/${legacy}`, to: `/projects/${slug}` })),
  );
