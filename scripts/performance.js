import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    url: { type: "string", default: "http://127.0.0.1:8080" },
    label: { type: "string", default: "current" },
    runs: { type: "string", default: "3" },
    out: { type: "string", default: "reports/performance" },
    routes: { type: "string", default: "/,/work,/about,/projects/modelaje" },
  },
});
const runs = Number(values.runs);
if (!Number.isInteger(runs) || runs < 1 || runs > 10)
  throw new Error("Usa entre 1 y 10 repeticiones");
const output = resolve(values.out);
await mkdir(output, { recursive: true });
const results = [];
for (const route of values.routes.split(",")) {
  for (const device of ["mobile", "desktop"]) {
    const samples = [];
    for (let run = 1; run <= runs; run++) {
      const file = resolve(
        output,
        `${values.label}-${route.replace(/\//g, "_") || "home"}-${device}-${run}.json`,
      );
      const args = [
        resolve("node_modules/lighthouse/cli/index.js"),
        new URL(route, values.url).href,
        "--chrome-flags=--headless=new --no-sandbox",
        "--only-categories=performance,seo",
        "--output=json",
        `--output-path=${file}`,
        "--quiet",
        ...(device === "desktop" ? ["--preset=desktop"] : []),
      ];
      await new Promise((done, reject) => {
        const child = spawn(process.execPath, args, { stdio: ["ignore", "ignore", "inherit"] });
        child.on("error", reject);
        child.on("exit", (code) =>
          code === 0 ? done() : reject(new Error(`Lighthouse terminó con ${code}`)),
        );
      });
      const report = JSON.parse(await readFile(file, "utf8"));
      if (report.runtimeError) throw new Error(report.runtimeError.message);
      samples.push({
        performance: Math.round(report.categories.performance.score * 100),
        seo: Math.round(report.categories.seo.score * 100),
        lcpMs: Math.round(report.audits["largest-contentful-paint"].numericValue),
        cls: report.audits["cumulative-layout-shift"].numericValue,
        tbtMs: Math.round(report.audits["total-blocking-time"].numericValue),
        transferBytes: report.audits["total-byte-weight"].numericValue,
      });
    }
    const median = (key) =>
      samples.map((sample) => sample[key]).sort((a, b) => a - b)[Math.floor(samples.length / 2)];
    const result = {
      route,
      device,
      runs,
      ...Object.fromEntries(Object.keys(samples[0]).map((key) => [key, median(key)])),
      samples,
    };
    results.push(result);
    console.log(JSON.stringify(result));
  }
}
await writeFile(
  resolve(output, `${values.label}-summary.json`),
  JSON.stringify(
    {
      measuredAt: new Date().toISOString(),
      node: process.version,
      lighthouse: JSON.parse(await readFile(resolve("node_modules/lighthouse/package.json")))
        .version,
      url: values.url,
      note: "Laboratorio Lighthouse con limitación simulada; TBT no equivale a INP. No contiene percentiles de usuarios reales.",
      results,
    },
    null,
    2,
  ) + "\n",
);
