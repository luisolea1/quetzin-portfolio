import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import sirv from "sirv";
import projects from "../app/content/projects.json" with { type: "json" };
import { deploymentConfig } from "./hosting.js";

export async function previewServer({
  directory = fileURLToPath(new URL("../build/client/", import.meta.url)),
  noIndex = false,
} = {}) {
  const errorPage = await readFile(resolve(directory, "404.html"));
  const rules = deploymentConfig(projects, { noIndex }).routes;
  const serve = sirv(directory, {
    brotli: true,
    gzip: true,
    etag: true,
    onNoMatch(req, res) {
      res.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, follow",
      });
      res.end(req.method === "HEAD" ? undefined : errorPage);
    },
  });
  return createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    for (const rule of rules) {
      if (rule.handle === "filesystem") break;
      if (!new RegExp(rule.src).test(url.pathname)) continue;
      for (const [key, value] of Object.entries(rule.headers ?? {})) res.setHeader(key, value);
      if (rule.status === 308) {
        res.setHeader("Location", rule.headers.Location + url.search);
        res.writeHead(308).end();
        return;
      }
      if (rule.status === 404) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(req.method === "HEAD" ? undefined : errorPage);
        return;
      }
      if (rule.dest) {
        req.url = rule.dest + url.search;
        break;
      }
    }
    serve(req, res);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await previewServer({
    directory: process.env.PREVIEW_DIRECTORY,
    noIndex: process.env.SEO_NOINDEX === "1",
  });
  const port = Number(process.env.PORT || 8080);
  server.listen(port, "127.0.0.1", () =>
    console.log(`Portfolio estático: http://127.0.0.1:${port}`),
  );
}
