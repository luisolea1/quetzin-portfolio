import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, access, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const widths = [320, 640, 960, 1440, 1920];
const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );

export async function prepareMedia() {
  const media = JSON.parse(await readFile(resolve(root, "app/content/media.json"), "utf8"));
  const manifestPath = resolve(root, ".cache/media.json");
  const previous = await readFile(manifestPath, "utf8")
    .then(JSON.parse)
    .catch(() => ({}));
  const assets = {};
  await mkdir(resolve(root, "public/images/generated"), { recursive: true });
  await mkdir(resolve(root, ".cache"), { recursive: true });
  for (const src of new Set(
    Object.values(media)
      .map((item) => item.src)
      .filter((src) => src?.startsWith("/")),
  )) {
    const input = await readFile(resolve(root, `public${src}`));
    const hash = createHash("sha256")
      .update(input)
      .update("webp-82-autoOrient-v1")
      .digest("hex")
      .slice(0, 16);
    const cached = previous[src];
    if (
      cached?.hash === hash &&
      (
        await Promise.all(cached.variants.map((v) => exists(resolve(root, `public${v.src}`))))
      ).every(Boolean)
    ) {
      assets[src] = cached;
      continue;
    }
    const metadata = await sharp(input).metadata();
    const rotated = [5, 6, 7, 8].includes(metadata.orientation);
    const width = rotated ? metadata.height : metadata.width;
    const height = rotated ? metadata.width : metadata.height;
    const variants = [];
    for (const target of new Set([
      ...widths.filter((size) => size < width),
      Math.min(width, 1920),
    ])) {
      const outputSrc = `/images/generated/${hash}-${target}.webp`;
      const info = await sharp(input)
        .autoOrient()
        .resize({ width: target, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(resolve(root, `public${outputSrc}`));
      variants.push({ src: outputSrc, width: info.width, bytes: info.size });
    }
    assets[src] = { hash, width, height, originalBytes: input.length, variants };
  }
  const output = JSON.stringify(assets, null, 2) + "\n";
  if (output !== JSON.stringify(previous, null, 2) + "\n") {
    const temporary = `${manifestPath}.${process.pid}.tmp`;
    await writeFile(temporary, output);
    await rename(temporary, manifestPath);
  }
  return assets;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const assets = await prepareMedia();
  console.log(
    `Imágenes preparadas: ${Object.keys(assets).length} originales, variantes WebP sin ampliar.`,
  );
}
