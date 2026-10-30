import { readFile, writeFile } from "node:fs/promises";
import { projects, site } from "../app/content/index.js";
import { getPagePaths } from "../app/content/paths.js";
import { parse } from "parse5";

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
export function sitemapXml(origin, paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${escapeXml(new URL(path, origin).href)}</loc></url>`).join("\n")}\n</urlset>\n`;
}
export const robotsTxt = (origin) => `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;

// Una dirección desconocida no puede hidratar el árbol prerenderizado para /404.
// El documento de error conserva estilos y enlaces HTML, sin montar React.
export function staticNotFound(source) {
  const edits = [];
  function visit(node) {
    const location = node.sourceCodeLocation;
    if (
      location &&
      (node.tagName === "script" ||
        (node.tagName === "link" &&
          node.attrs.some((attr) => attr.name === "rel" && attr.value === "modulepreload")))
    ) {
      edits.push({ start: location.startOffset, end: location.endOffset, value: "" });
      return;
    }
    if (location && node.tagName === "button") {
      const className = node.attrs.find((attr) => attr.name === "class")?.value || "";
      const content = source.slice(location.startTag.endOffset, location.endTag.startOffset);
      edits.push({
        start: location.startOffset,
        end: location.endOffset,
        value: `<a class="${escapeXml(className)}" href="#">${content}</a>`,
      });
      return;
    }
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(source, { sourceCodeLocationInfo: true }));
  for (const edit of edits.sort((a, b) => b.start - a.start))
    source = source.slice(0, edit.start) + edit.value + source.slice(edit.end);
  return source;
}

if (process.argv[1]?.endsWith("/generate-seo.js")) {
  const directory = new URL("../build/client/", import.meta.url);
  await writeFile(new URL("sitemap.xml", directory), sitemapXml(site.url, getPagePaths(projects)));
  await writeFile(new URL("robots.txt", directory), robotsTxt(site.url));
  await writeFile(
    new URL("404.html", directory),
    staticNotFound(await readFile(new URL("404/index.html", directory), "utf8")),
  );
  console.log("SEO estático: sitemap.xml, robots.txt y página auxiliar 404 generados.");
}
