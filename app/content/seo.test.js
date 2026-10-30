import assert from "node:assert/strict";
import test from "node:test";
import { projects, site } from "./index.js";
import { createPageMeta, getSeoPage, getStructuredData } from "./seo.js";
import { getPagePaths, getLegacyRedirects } from "./paths.js";
import { applyMediaVariants } from "./media-variants.js";
import { validate } from "./validate.js";
import { media } from "./index.js";

test("seven canonical pages have distinct editorial metadata and absolute social URLs", () => {
  const paths = getPagePaths(projects);
  assert.equal(paths.length, 7);
  const titles = new Set(),
    descriptions = new Set();
  for (const path of paths) {
    const tags = createPageMeta(path);
    titles.add(tags.find((tag) => tag.title).title);
    descriptions.add(tags.find((tag) => tag.name === "description").content);
    assert.equal(
      tags.find((tag) => tag.rel === "canonical").href,
      site.url + (path === "/" ? "/" : path),
    );
    for (const tag of tags.filter(
      (tag) => ["og:url", "og:image"].includes(tag.property) || tag.name === "twitter:image",
    ))
      assert.match(tag.content, /^https:\/\//);
    assert.equal(tags.find((tag) => tag.name === "robots").content, "index, follow");
  }
  assert.equal(titles.size, 7);
  assert.equal(descriptions.size, 7);
  assert.match(getSeoPage("/").title, /Fotografía y producción audiovisual/);
  assert.equal(getSeoPage("/projects/proyecto-01"), null);
});

test("previews and unknown paths are noindex without inventing canonicals for errors", () => {
  for (const path of getPagePaths(projects))
    assert.equal(
      createPageMeta(path, { noIndex: true }).find((tag) => tag.name === "robots").content,
      "noindex, follow",
    );
  for (const path of ["/404", "/inexistente", "/projects/no-existe"]) {
    const tags = createPageMeta(path);
    assert.equal(tags.find((tag) => tag.name === "robots").content, "noindex, follow");
    assert.ok(!tags.some((tag) => tag.rel === "canonical" || tag["script:ld+json"]));
  }
});

test("JSON-LD connects real person, website, profile, collection and creative works", () => {
  for (const path of getPagePaths(projects)) {
    const graph = getStructuredData(getSeoPage(path))["@graph"];
    const person = graph.find((item) => item["@type"] === "Person");
    assert.equal(person.name, site.name);
    assert.deepEqual(person.sameAs, site.socials.map((item) => item.url).filter(Boolean));
    assert.ok(!person.address && !person.aggregateRating && !person.award);
    const page = graph.find((item) =>
      ["WebPage", "ProfilePage", "CollectionPage"].includes(item["@type"]),
    );
    if (path === "/about") assert.equal(page.mainEntity["@id"], person["@id"]);
    if (path === "/work")
      assert.deepEqual(
        page.mainEntity.itemListElement.map((item) => item.url),
        projects.map((item) => `${site.url}/projects/${item.slug}`),
      );
    if (path.startsWith("/projects/")) {
      const work = graph.find((item) => item["@type"] === "CreativeWork");
      assert.equal(work.creator["@id"], person["@id"]);
      assert.equal(page.mainEntity["@id"], work["@id"]);
    }
  }
});

test("aliases derive from editable slugs and remain outside the canonical inventory", () => {
  const edited = structuredClone(projects);
  edited[0].slug = "nuevo-modelaje";
  const redirects = getLegacyRedirects(edited);
  assert.equal(redirects.length, 4);
  assert.equal(redirects[0].to, "/projects/nuevo-modelaje");
  assert.ok(!getPagePaths(edited).includes(redirects[0].from));
});

test("responsive variants retain originals, actual dimensions and a shared carousel source", () => {
  const original = {
    image: { src: "/photo.webp", alt: "Foto", position: "50% 85%" },
    remote: { src: "https://example.com/photo.webp", alt: "Remota" },
  };
  const assets = {
    "/photo.webp": {
      width: 1600,
      height: 2000,
      variants: [320, 640, 960, 1440].map((width) => ({ src: `/generated-${width}.webp`, width })),
    },
  };
  const result = applyMediaVariants(original, assets);
  assert.equal(result.image.originalSrc, "/photo.webp");
  assert.equal(original.image.src, "/photo.webp");
  assert.equal(result.image.src, "/generated-960.webp");
  assert.equal(result.image.carouselSrc, "/generated-640.webp");
  assert.equal(result.image.width, 1600);
  assert.equal(result.image.position, "50% 85%");
  assert.match(result.image.srcSet, /1440w$/);
  assert.deepEqual(result.remote, original.remote);
});

test("SEO configuration rejects invalid origins, missing social references and empty descriptions", () => {
  for (const url of ["http://example.com", "https://example.com/path", "https://example.com/"])
    assert.throws(() => validate({ ...site, url }, projects, media), /URL principal/);
  const invalid = structuredClone(site);
  invalid.seo.home.image = "missing";
  assert.throws(() => validate(invalid, projects, media), /inexistente/);
  const edited = structuredClone(projects);
  edited[0].description = "";
  assert.throws(() => validate(site, edited, media), /Descripción SEO/);
});
