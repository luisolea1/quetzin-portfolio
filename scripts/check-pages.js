import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parse } from "parse5";
import { media, projects, site } from "../app/content/index.js";

const pages = [
  {
    route: "/",
    title: `${site.name} — Portfolio`,
    description: site.intro,
    cards: projects.filter((project) => project.featured),
  },
  {
    route: "/work",
    title: `Work — ${site.name}`,
    description: site.workIntro,
    cards: projects,
  },
  {
    route: "/about",
    title: `About — ${site.name}`,
    description: site.aboutIntro,
    cards: [],
  },
  ...projects.map((project) => ({
    route: `/projects/${project.slug}`,
    title: `${project.title} — ${site.name}`,
    description: project.description,
    cards: project.related.map((id) => projects.find((item) => item.id === id)),
  })),
];

function elements(node) {
  return [...(node.tagName ? [node] : []), ...(node.childNodes ?? []).flatMap(elements)];
}

function attribute(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value;
}

function text(node) {
  return node.value ?? (node.childNodes ?? []).map(text).join("");
}

for (const page of pages) {
  const filename = page.route === "/" ? "index.html" : `${page.route.slice(1)}/index.html`;
  const document = parse(
    await readFile(new URL(`../build/client/${filename}`, import.meta.url), "utf8"),
  );
  const nodes = elements(document);
  const find = (tag) => nodes.filter((node) => node.tagName === tag);
  const expect = (condition, message) => assert.ok(condition, `${page.route}: ${message}`);

  expect(attribute(find("html")[0], "lang") === "es", "falta el idioma del documento");
  expect(find("main").length === 1, "debe existir un único contenido principal");
  expect(find("h1").length === 1 && text(find("h1")[0]).trim(), "debe existir un único h1");
  expect(text(find("title")[0]) === page.title, "el título no corresponde a la ruta");
  expect(
    find("meta").some(
      (node) =>
        attribute(node, "name") === "description" &&
        attribute(node, "content") === page.description,
    ),
    "la descripción no corresponde a la ruta",
  );

  const bodyChildren = find("body")[0].childNodes;
  const header = bodyChildren.find((node) => node.tagName === "header");
  expect(
    bodyChildren.filter((node) => node.tagName === "header").length === 1,
    "falta la cabecera compartida",
  );
  expect(
    bodyChildren.filter((node) => node.tagName === "footer").length === 1,
    "falta el pie compartido",
  );
  const workLink = elements(header).find(
    (node) => node.tagName === "a" && attribute(node, "href") === "/work",
  );
  expect(
    text(workLink).replace(/\s+/g, " ").trim() ===
      `Work (${String(projects.length).padStart(2, "0")})`,
    "el contador de Work no coincide con el catálogo",
  );

  const ids = new Map();
  for (const node of nodes) {
    const id = attribute(node, "id");
    if (id) {
      expect(!ids.has(id), `identificador duplicado: ${id}`);
      ids.set(id, node);
    }
    expect(
      !/(?:\bundefined\b|\[object Object\])/u.test(attribute(node, "class") ?? ""),
      "hay una clase CSS sin resolver",
    );
  }

  const carousels = nodes.filter((node) => attribute(node, "aria-roledescription") === "carrusel");
  const hasCarousel = page.route === "/" || page.route === "/about";
  expect(carousels.length === (hasCarousel ? 1 : 0), "el carrusel no corresponde a esta plantilla");
  if (hasCarousel) {
    const carousel = carousels[0];
    expect(
      attribute(carousel, "data-ready") === undefined,
      "el HTML debe comenzar con el respaldo visible",
    );
    const fallback = carousel.childNodes.find((node) =>
      attribute(node, "class")?.includes("circular-carousel__fallback_"),
    );
    expect(fallback, "falta el respaldo HTML del carrusel");
    const cards = fallback.childNodes.filter((node) => node.tagName === "div");
    expect(cards.length === 8, "el respaldo debe conservar las ocho fotos del anillo");
    for (const [index, id] of site.carousel.entries()) {
      const resource = media[id];
      expect(
        attribute(cards[index], "aria-label") === resource.alt,
        `falta el nombre accesible de ${id} en el respaldo`,
      );
      const images = elements(cards[index]).filter((node) => node.tagName === "img");
      if (resource.src) {
        expect(
          images.length === 1 && attribute(images[0], "src") === resource.src,
          `imagen incorrecta en el carrusel: ${id}`,
        );
        expect(attribute(images[0], "alt") === resource.alt, `falta la descripción de ${id}`);
      } else {
        expect(
          elements(cards[index]).some((node) => attribute(node, "role") === "img"),
          `falta el espacio reservado de ${id}`,
        );
      }
    }
  }

  for (const node of nodes) {
    const references = attribute(node, "aria-labelledby")?.split(/\s+/u) ?? [];
    for (const id of references) {
      expect(ids.has(id) && text(ids.get(id)).trim(), `nombre accesible inexistente: ${id}`);
    }
    if (node.tagName === "section" || node.tagName === "nav") {
      expect(
        references.length > 0 || attribute(node, "aria-label")?.trim(),
        `${node.tagName} sin nombre accesible`,
      );
    }
  }

  const cardLinks = elements(find("main")[0])
    .filter((node) => node.tagName === "a")
    .map((node) => attribute(node, "href"))
    .filter((href) => href?.startsWith("/projects/"));
  assert.deepEqual(
    cardLinks,
    page.cards.map((project) => `/projects/${project.slug}`),
    `${page.route}: las tarjetas no corresponden al contenido de la página`,
  );
}

console.log(
  `HTML verificado: ${pages.length} rutas con metadatos, secciones y enlaces coherentes.`,
);
