import { getLegacyRedirects, getPagePaths } from "../app/content/paths.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function deploymentConfig(projects, { noIndex = false } = {}) {
  const paths = getPagePaths(projects);
  return {
    version: 3,
    routes: [
      ...(noIndex
        ? [{ src: "/.*", headers: { "X-Robots-Tag": "noindex, follow" }, continue: true }]
        : []),
      ...getLegacyRedirects(projects).map(({ from, to }) => ({
        src: `^${escapeRegex(from)}/?$`,
        status: 308,
        headers: { Location: to },
      })),
      { src: "^/index\\.html$", status: 308, headers: { Location: "/" } },
      ...paths
        .filter((path) => path !== "/")
        .flatMap((path) => [
          {
            src: `^${escapeRegex(path)}(?:/|/index\\.html)$`,
            status: 308,
            headers: { Location: path },
          },
          { src: `^${escapeRegex(path)}$`, dest: `${path}/index.html` },
        ]),
      {
        src: "^/(?:404(?:/index\\.html|/)?|404\\.html|__spa-fallback\\.html)$",
        dest: "/404.html",
        status: 404,
        headers: { "X-Robots-Tag": "noindex, follow" },
      },
      {
        src: "^/(?:assets|images/generated)/.*$",
        headers: { "Cache-Control": "public, max-age=31536000, immutable" },
        continue: true,
      },
      { handle: "filesystem" },
      {
        src: "/.*",
        dest: "/404.html",
        status: 404,
        headers: { "X-Robots-Tag": "noindex, follow" },
      },
    ],
    cache: [".cache/**", "public/images/generated/**"],
  };
}
