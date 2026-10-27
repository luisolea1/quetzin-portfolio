import assert from "node:assert/strict";
import test from "node:test";
import {
  findProject,
  findLegacyProject,
  getCarouselItems,
  getWorkCarouselItems,
  media,
  projects,
  site,
  validateContent,
} from "./index.js";
import { validate } from "./validate.js";
import { getGalleryItems, MAX_GALLERY_IMAGES } from "./gallery.js";

test("the four editable projects have valid references and removed slugs return no project", () => {
  assert.equal(validateContent(), true);
  assert.equal(projects.length, 4);
  assert.equal(projects.filter((project) => project.featured).length, 4);
  assert.equal(findProject("missing"), undefined);
  assert.equal(findProject("proyecto-05"), undefined);
  assert.equal(findProject("proyecto-06"), undefined);
});

test("duplicate slugs are rejected", () => {
  const duplicate = structuredClone(projects);
  duplicate[1].slug = duplicate[0].slug;
  assert.throws(() => validate(site, duplicate, media), /duplicado/);
});

test("readable project slugs resolve by name and previous URLs remain aliases", () => {
  assert.deepEqual(
    projects.map(({ slug }) => slug),
    ["modelaje", "paisajes", "producto", "musica"],
  );
  for (const [index, project] of projects.entries()) {
    assert.equal(findProject(project.slug), project);
    assert.equal(findProject(`proyecto-0${index + 1}`), undefined);
    assert.equal(findLegacyProject(`proyecto-0${index + 1}`), project);
  }
  assert.equal(findLegacyProject("desconocido"), undefined);
  const broken = structuredClone(projects);
  broken[0].legacySlugs = [broken[1].slug];
  assert.throws(() => validate(site, broken, media), /Slug anterior/);
  broken[0].legacySlugs = [broken[1].legacySlugs[0]];
  assert.throws(() => validate(site, broken, media), /Slug anterior/);
});

test("gallery items preserve appearances, crops, dimensions and the individual mobile order", () => {
  const blocks = [
    { type: "pair", items: ["portrait", "landscape"], mobileOrder: [1, 0] },
    { type: "wide", media: "portrait", aspectRatio: 2 },
    { type: "image", media: "pending" },
  ];
  const resources = {
    portrait: { src: "/portrait.webp", position: "50% 80%", width: 600, height: 800 },
    landscape: { src: "/landscape.webp", width: 1200, height: 800 },
    pending: { src: null, alt: "Pendiente" },
  };
  const items = getGalleryItems(blocks, resources);
  assert.deepEqual(
    items.map(({ id }) => id),
    ["portrait", "landscape", "portrait", "pending"],
  );
  assert.equal(new Set(items.map(({ key }) => key)).size, 4);
  assert.deepEqual(
    items.map(({ aspectRatio }) => aspectRatio),
    [0.75, 1, 2, 0.75],
  );
  assert.deepEqual(
    [...items].sort((a, b) => a.mobileOrder - b.mobileOrder).map(({ id }) => id),
    ["landscape", "portrait", "portrait", "pending"],
  );
  assert.equal(items[0].media.position, "50% 80%");
  assert.equal(items[3].media.src, null);
});

test("gallery accepts ten appearances including pending photos and rejects an eleventh", () => {
  const edited = structuredClone(projects);
  // La pareja cuenta como dos, no como un único bloque.
  edited[0].gallery = [
    ...edited[0].gallery,
    ...Array.from(
      { length: MAX_GALLERY_IMAGES - getGalleryItems(projects[0].gallery, media).length },
      () => ({ type: "image", media: "pending" }),
    ),
  ];
  const resources = { ...media, pending: { src: null, alt: "Foto pendiente" } };
  assert.equal(validate(site, edited, resources), true);
  assert.equal(getGalleryItems(edited[0].gallery, resources).length, MAX_GALLERY_IMAGES);
  edited[0].gallery.push({ type: "image", media: "pending" });
  assert.throws(() => validate(site, edited, resources), /hasta 10 fotos/);
  edited[0].gallery.pop();
  edited[0].gallery.at(-1).media = "missing";
  assert.throws(() => validate(site, edited, resources), /recurso inexistente/);
});

test("gallery repeats a square on the right after two portrait pairs and includes the added photo", () => {
  const items = getGalleryItems(
    Array.from({ length: 10 }, () => ({ type: "image", media: "gallery01a" })),
    media,
  );
  assert.deepEqual(
    items.map(({ aspectRatio }) => aspectRatio),
    [0.75, 1, 0.75, 0.75, 0.75, 0.75, 0.75, 1, 0.75, 0.75],
  );
  assert.ok(
    getGalleryItems(projects[0].gallery, media).some(({ id }) => id === "modelajeGallery04"),
  );
});

test("gallery rejects invalid ratios and incomplete dimensions", () => {
  const edited = structuredClone(projects);
  for (const aspectRatio of [0, -1, "3/4", Infinity]) {
    edited[0].gallery[0].aspectRatio = aspectRatio;
    assert.throws(() => validate(site, edited, media), /Proporción de galería/);
  }
  const resources = structuredClone(media);
  resources.gallery01a.width = 0;
  assert.throws(() => validate(site, projects, resources), /Dimensiones/);
  delete resources.gallery01a.width;
  assert.throws(() => validate(site, projects, resources), /Dimensiones/);
});

test("the eight carousel photos preserve their own order and stay independent of covers", () => {
  const items = getCarouselItems();
  assert.equal(items.length, 8);
  assert.deepEqual(
    items.map(({ id }) => id),
    site.carousel,
  );
  for (const [index, id] of site.carousel.entries()) {
    assert.equal(items[index].src, media[id].src);
    assert.equal(items[index].alt, media[id].alt);
    assert.equal(items[index].position, media[id].position);
    assert.ok(!projects.some((project) => project.cover === id));
  }

  const edited = structuredClone(media);
  edited[projects[0].cover].src = "/images/projects/modelaje/otra-portada.webp";
  assert.deepEqual(getCarouselItems(site, edited), items);
  edited[site.carousel[0]].src = "/images/carousel/01.webp";
  assert.equal(getCarouselItems(site, edited)[0].src, "/images/carousel/01.webp");
  assert.equal(edited[projects[0].cover].src, "/images/projects/modelaje/otra-portada.webp");
  assert.deepEqual(
    getCarouselItems({ ...site, carousel: [...site.carousel].reverse() }).map(({ id }) => id),
    [...site.carousel].reverse(),
  );
});

test("carousel references must be eight distinct existing resources independent of covers", () => {
  const broken = structuredClone(site);
  broken.carousel.pop();
  assert.throws(() => validate(broken, projects, media), /ocho referencias/);
  broken.carousel = [...site.carousel];
  broken.carousel[1] = broken.carousel[0];
  assert.throws(() => validate(broken, projects, media), /ocho referencias/);
  broken.carousel = [...site.carousel];
  broken.carousel[0] = "missing";
  assert.throws(() => validate(broken, projects, media), /recurso inexistente/);
  broken.carousel[0] = projects[0].cover;
  assert.throws(() => validate(broken, projects, media), /independientes de las portadas/);
});

test("Work carousel photos stay independent and follow their editable order", () => {
  const homeItems = getCarouselItems();
  const workItems = getWorkCarouselItems();
  assert.equal(workItems.length, 8);
  assert.deepEqual(
    workItems.map(({ id }) => id),
    site.workCarousel,
  );
  const edited = structuredClone(media);
  edited[site.workCarousel[0]].src = "/images/work/carousel/01.webp";
  assert.equal(getWorkCarouselItems(site, edited)[0].src, "/images/work/carousel/01.webp");
  assert.deepEqual(getCarouselItems(site, edited), homeItems);
  edited[site.carousel[0]].src = "/images/carousel/otra-foto.webp";
  assert.equal(getWorkCarouselItems(site, edited)[0].src, "/images/work/carousel/01.webp");
  assert.deepEqual(
    getWorkCarouselItems({ ...site, workCarousel: [...site.workCarousel].reverse() }).map(
      ({ id }) => id,
    ),
    [...site.workCarousel].reverse(),
  );
});

test("Work requires eight distinct existing photos separate from Home and covers", () => {
  const broken = structuredClone(site);
  broken.workCarousel.pop();
  assert.throws(() => validate(broken, projects, media), /Work requiere ocho referencias/);
  broken.workCarousel = [...site.workCarousel];
  broken.workCarousel[1] = broken.workCarousel[0];
  assert.throws(() => validate(broken, projects, media), /Work requiere ocho referencias/);
  broken.workCarousel = [...site.workCarousel];
  broken.workCarousel[0] = "missing";
  assert.throws(() => validate(broken, projects, media), /recurso inexistente/);
  broken.workCarousel[0] = site.carousel[0];
  assert.throws(() => validate(broken, projects, media), /independientes del anillo/);
  broken.workCarousel[0] = projects[0].cover;
  assert.throws(() => validate(broken, projects, media), /independientes de las portadas/);
});

test("the catalog requires four projects", () => {
  assert.throws(() => validate(site, projects.slice(0, 3), media), /cuatro proyectos/);
  assert.throws(() => validate(site, [...projects, projects[0]], media), /cuatro proyectos/);
});

test("unknown media and broken mobile order are rejected", () => {
  const broken = structuredClone(projects);
  broken[0].hero = "unknown";
  assert.throws(() => validate(site, broken, media), /recurso inexistente/);
  broken[0].hero = projects[0].hero;
  broken[0].gallery[0].mobileOrder = [1, 1];
  assert.throws(() => validate(site, broken, media), /Orden móvil/);
});

test("unsafe editable links and repeated related projects are rejected", () => {
  const broken = structuredClone(projects);
  broken[0].url = "javascript:alert(1)";
  assert.throws(() => validate(site, broken, media), /enlace inválido/);
  broken[0].url = null;
  broken[0].related = ["project02", "project02"];
  assert.throws(() => validate(site, broken, media), /relacionados inválidos/);
});
