import { site, projects, media, findProject } from "./index.js";

export const absoluteUrl = (path) => new URL(path, `${site.url}/`).href;

export function getSeoPage(path) {
  const key = { "/": "home", "/work": "work", "/about": "about" }[path];
  if (key) return { ...site.seo[key], path, key };
  const project = path.startsWith("/projects/") ? findProject(path.slice(10)) : null;
  return project
    ? {
        path,
        key: "project",
        project,
        title: project.seoTitle || `${project.title} — ${site.name}`,
        description: project.description,
        image: project.hero,
      }
    : null;
}

export function getStructuredData(page) {
  const websiteId = `${site.url}/#website`;
  const personId = `${site.url}/#person`;
  const url = absoluteUrl(page.path);
  const photo = (id) => {
    const item = media[id];
    return item?.src ? absoluteUrl(item.originalSrc || item.src) : undefined;
  };
  const person = {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    url: absoluteUrl("/about"),
    description: site.bio[0],
    image: photo(site.portrait),
    sameAs: site.socials.map((item) => item.url).filter(Boolean),
  };
  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: absoluteUrl("/"),
    name: site.name,
    inLanguage: "es",
    publisher: { "@id": personId },
  };
  const webpage = {
    "@type":
      page.key === "about" ? "ProfilePage" : page.key === "work" ? "CollectionPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: "es",
    isPartOf: { "@id": websiteId },
    primaryImageOfPage: photo(page.image)
      ? { "@type": "ImageObject", url: photo(page.image) }
      : undefined,
  };
  const graph = [website, person, webpage];
  if (page.key === "about" || page.key === "home") webpage.mainEntity = { "@id": personId };
  if (page.key === "work")
    webpage.mainEntity = {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: absoluteUrl(`/projects/${project.slug}`),
      })),
    };
  if (page.project) {
    const workId = `${url}#work`;
    webpage.mainEntity = { "@id": workId };
    graph.push({
      "@type": "CreativeWork",
      "@id": workId,
      url,
      name: page.project.title,
      description: page.description,
      creator: { "@id": personId },
      image: photo(page.image),
      mainEntityOfPage: { "@id": webpage["@id"] },
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function createPageMeta(path, { noIndex = false } = {}) {
  const page = getSeoPage(path);
  if (!page)
    return [
      { title: `Página no encontrada — ${site.name}` },
      { name: "robots", content: "noindex, follow" },
    ];
  const image = media[page.image];
  const imageUrl = image?.src ? absoluteUrl(image.originalSrc || image.src) : null;
  return [
    { title: page.title },
    { name: "description", content: page.description },
    { name: "robots", content: noIndex ? "noindex, follow" : "index, follow" },
    { tagName: "link", rel: "canonical", href: absoluteUrl(page.path) },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "es_MX" },
    { property: "og:site_name", content: site.name },
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:url", content: absoluteUrl(page.path) },
    { name: "twitter:card", content: imageUrl ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
    ...(imageUrl
      ? [
          { property: "og:image", content: imageUrl },
          { property: "og:image:alt", content: image.alt },
          ...(image.width && image.height
            ? [
                { property: "og:image:width", content: String(image.width) },
                { property: "og:image:height", content: String(image.height) },
              ]
            : []),
          { name: "twitter:image", content: imageUrl },
          { name: "twitter:image:alt", content: image.alt },
        ]
      : []),
    { "script:ld+json": getStructuredData(page) },
  ];
}
