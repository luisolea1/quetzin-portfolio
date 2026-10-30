import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import projects from "../app/content/projects.json" with { type: "json" };
import { deploymentConfig } from "./hosting.js";

// Vercel consume esta salida estática; no se añade un servidor de aplicación.
const output = new URL("../.vercel/output/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL("../build/client/", import.meta.url), new URL("static/", output), {
  recursive: true,
});
await writeFile(
  new URL("config.json", output),
  JSON.stringify(
    deploymentConfig(projects, {
      noIndex: process.env.VERCEL_ENV === "preview" || process.env.SEO_NOINDEX === "1",
    }),
    null,
    2,
  ) + "\n",
);
console.log("Salida estática de Vercel: siete rutas, alias 308 y errores HTTP 404.");
