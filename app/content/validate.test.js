import assert from "node:assert/strict";
import test from "node:test";
import {
  findProject,
  getCarouselItems,
  getWorkCarouselItems,
  media,
  projects,
  site,
  validateContent,
} from "./index.js";
import { validate } from "./validate.js";

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
  edited[projects[0].cover].src = "/images/projects/proyecto-01/otra-portada.webp";
  assert.deepEqual(getCarouselItems(site, edited), items);
  edited[site.carousel[0]].src = "/images/carousel/01.webp";
  assert.equal(getCarouselItems(site, edited)[0].src, "/images/carousel/01.webp");
  assert.equal(edited[projects[0].cover].src, "/images/projects/proyecto-01/otra-portada.webp");
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
