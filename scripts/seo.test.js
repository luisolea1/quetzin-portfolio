import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import projects from "../app/content/projects.json" with { type: "json" };
import { getLegacyRedirects, getPagePaths } from "../app/content/paths.js";
import { deploymentConfig } from "./hosting.js";
import { sitemapXml, robotsTxt, staticNotFound } from "./generate-seo.js";
import { previewServer } from "./preview.js";
import { compressStatic } from "./compress-static.js";
import { brotliDecompressSync, gunzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";

test("Brotli and gzip preserve the original HTML byte for byte", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "quetzin-compression-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const html = Buffer.from(
    `<main>${"<p>Fotografía y producción audiovisual.</p>".repeat(80)}</main>`,
  );
  await writeFile(join(directory, "index.html"), html);
  await compressStatic(directory);
  assert.deepEqual(await readFile(join(directory, "index.html")), html);
  assert.deepEqual(brotliDecompressSync(await readFile(join(directory, "index.html.br"))), html);
  assert.deepEqual(gunzipSync(await readFile(join(directory, "index.html.gz"))), html);
});

test("unknown URL error HTML keeps navigation and styles without mismatched React hydration", () => {
  const source =
    '<!doctype html><html><head><link rel="stylesheet" href="/style.css"><link rel="modulepreload" href="/app.js"><meta name="robots" content="noindex"></head><body><h1>No existe</h1><a href="/">Inicio</a><button class="top" type="button">Volver arriba</button><script src="/app.js"></script><script>hydrate()</script></body></html>';
  const result = staticNotFound(source);
  assert.ok(
    !result.includes("<script") && !result.includes("modulepreload") && !result.includes("<button"),
  );
  assert.match(result, /href="\/style.css"/);
  assert.match(result, /<a href="\/">Inicio<\/a>/);
  assert.match(result, /<a class="top" href="#">Volver arriba<\/a>/);
});

test("sitemap contains only the seven canonical URLs and escapes XML without fake modification dates", () => {
  const sitemap = sitemapXml("https://example.com", getPagePaths(projects));
  assert.equal(sitemap.match(/<loc>/g).length, 7);
  assert.ok(!/lastmod|priority|changefreq|proyecto-01|\/404/.test(sitemap));
  assert.match(sitemapXml("https://example.com", ["/?a=1&b=2"]), /a=1&amp;b=2/);
  assert.match(
    robotsTxt("https://example.com"),
    /^User-agent: \*\nAllow: \/\n\nSitemap: https:\/\/example.com\/sitemap.xml\n$/,
  );
});

test("Vercel routing derives 308 aliases, explicit canonical files and 404 fallback", () => {
  const config = deploymentConfig(projects);
  for (const redirect of getLegacyRedirects(projects)) {
    const rule = config.routes.find((rule) => rule.src && new RegExp(rule.src).test(redirect.from));
    assert.equal(rule.status, 308);
    assert.equal(rule.headers.Location, redirect.to);
  }
  assert.ok(config.routes.some((rule) => rule.handle === "filesystem"));
  assert.equal(config.routes.at(-1).status, 404);
  assert.equal(config.routes.at(-1).dest, "/404.html");
  assert.ok(!config.routes[0].headers?.["X-Robots-Tag"]);
  assert.equal(
    deploymentConfig(projects, { noIndex: true }).routes[0].headers["X-Robots-Tag"],
    "noindex, follow",
  );
});

test("static preview serves known pages, real 404s, query-preserving redirects and preview noindex", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "quetzin-static-"));
  await writeFile(join(directory, "404.html"), "<h1>Esta página no existe.</h1>");
  for (const path of getPagePaths(projects)) {
    const folder = join(directory, path);
    await mkdir(folder, { recursive: true });
    await writeFile(join(folder, "index.html"), `<h1>${path}</h1>`);
  }
  const server = await previewServer({ directory, noIndex: true });
  t.after(async () => {
    await new Promise((done) => server.close(done));
    await rm(directory, { recursive: true, force: true });
  });
  await new Promise((done, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", done);
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const path of getPagePaths(projects)) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, follow");
    assert.equal(await response.text(), `<h1>${path}</h1>`);
  }
  for (const { from, to } of getLegacyRedirects(projects)) {
    const response = await fetch(`${origin}${from}?ref=test`, { redirect: "manual" });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `${to}?ref=test`);
  }
  for (const path of ["/no-existe", "/projects/no-existe", "/404", "/missing.webp"]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 404, path);
    assert.match(await response.text(), /Esta página no existe/);
  }
});
