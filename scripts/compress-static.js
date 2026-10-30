import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { brotliCompress, gzip, constants } from "node:zlib";

export async function compressStatic(directory) {
  const files = (await readdir(directory, { recursive: true })).filter((file) =>
    /\.(?:html|js|css|json|xml|txt|svg|data)$/.test(file),
  );
  for (const file of files) {
    const source = await readFile(resolve(directory, file));
    if (source.length < 1024) continue;
    const brotli = await promisify(brotliCompress)(source, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 5 },
    });
    const gzipped = await promisify(gzip)(source, { level: 6 });
    await writeFile(resolve(directory, `${file}.br`), brotli);
    await writeFile(resolve(directory, `${file}.gz`), gzipped);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await compressStatic(resolve(process.argv[2] || "build/client"));
  console.log("Recursos de texto preparados con Brotli y gzip.");
}
