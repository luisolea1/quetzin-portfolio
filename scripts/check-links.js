import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";
import { projects, site } from "../app/content/index.js";
import { getPagePaths } from "../app/content/paths.js";

export const elements = (node) => [
  ...(node.tagName ? [node] : []),
  ...(node.childNodes ?? []).flatMap(elements),
];
export const attr = (node, key) => node.attrs?.find((item) => item.name === key)?.value;
const directory = new URL("../build/client/", import.meta.url);
const fileFor = (path) => (path === "/" ? "index.html" : `${path.slice(1)}/index.html`);

export async function checkLinks({ external = false } = {}) {
  const paths = getPagePaths(projects);
  const documents = new Map(
    await Promise.all(
      paths.map(async (path) => [
        path,
        elements(parse(await readFile(new URL(fileFor(path), directory), "utf8"))),
      ]),
    ),
  );
  const externalUrls = new Set(site.socials.map((social) => social.url).filter(Boolean));
  let checked = 0;
  for (const [path, nodes] of documents) {
    const references = [];
    for (const node of nodes) {
      if (["a", "link"].includes(node.tagName)) references.push(attr(node, "href"));
      if (node.tagName === "link" && attr(node, "rel") === "stylesheet") {
        const stylesheet = new URL(attr(node, "href"), new URL(path, site.url));
        if (stylesheet.origin === site.url) {
          const css = await readFile(new URL(`.${stylesheet.pathname}`, directory), "utf8");
          for (const match of css.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) {
            if (!match[1].startsWith("data:")) references.push(new URL(match[1], stylesheet).href);
          }
        }
      }
      if (["img", "script"].includes(node.tagName)) references.push(attr(node, "src"));
      if (node.tagName === "img" && attr(node, "srcset"))
        references.push(
          ...attr(node, "srcset")
            .split(",")
            .map((part) => part.trim().split(/\s+/)[0]),
        );
      if (
        node.tagName === "meta" &&
        ["og:image", "twitter:image"].includes(attr(node, "property") || attr(node, "name"))
      )
        references.push(attr(node, "content"));
    }
    for (const href of references.filter(Boolean)) {
      if (href.startsWith("mailto:")) {
        assert.match(href.slice(7), /^[^\s@]+@[^\s@]+\.[^\s@]+$/, `${path}: correo inválido`);
        continue;
      }
      if (href.startsWith("tel:")) {
        assert.match(href.slice(4), /^\+?\d{7,15}$/, `${path}: teléfono inválido`);
        continue;
      }
      if (href.startsWith("data:")) continue;
      const url = new URL(href, new URL(path, site.url));
      assert.ok(["https:", "http:"].includes(url.protocol), `${path}: protocolo inválido ${href}`);
      if (url.origin !== site.url) {
        externalUrls.add(url.href);
        continue;
      }
      const target = url.pathname.replace(/\/$/, "") || "/";
      if (documents.has(target)) {
        if (url.hash)
          assert.ok(
            documents
              .get(target)
              .some((node) => attr(node, "id") === decodeURIComponent(url.hash.slice(1))),
            `${path}: ancla inexistente ${href}`,
          );
      } else {
        assert.ok(!url.hash, `${path}: destino o ancla inexistente ${href}`);
        await access(new URL(`.${url.pathname}`, directory)).catch(() => {
          throw new Error(`${path}: archivo inexistente ${href}`);
        });
      }
      checked++;
    }
  }
  console.log(
    `Enlaces y recursos locales verificados: ${checked} referencias en ${paths.length} páginas.`,
  );
  if (external) {
    let broken = 0;
    for (const url of externalUrls) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(15000),
          headers: { "User-Agent": "PortfolioLinkCheck/1.0" },
        });
        await response.body?.cancel();
        const status = [401, 403, 429].includes(response.status)
          ? "BLOQUEADO: revisión manual"
          : response.status === 404 || response.status === 410
            ? "ROTO"
            : response.ok
              ? "OK"
              : "NO CONCLUYENTE";
        if (status === "ROTO") broken++;
        console.log(
          `${status} ${response.status} ${url}${response.url !== url ? ` → ${response.url}` : ""}`,
        );
      } catch (error) {
        console.log(`NO CONCLUYENTE ${url}: ${error.cause?.code || error.name}`);
      }
    }
    assert.equal(broken, 0, "Hay enlaces externos confirmados como inexistentes");
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await checkLinks({ external: process.argv.includes("--external") });
