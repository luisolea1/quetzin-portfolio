import { isDeepStrictEqual } from "node:util";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";
import { format } from "prettier";

const preservedElements = new Set(["script", "style", "pre", "textarea", "svg"]);

function snapshot(node) {
  return {
    nodeName: node.nodeName,
    namespaceURI: node.namespaceURI,
    name: node.name,
    publicId: node.publicId,
    systemId: node.systemId,
    value: node.value,
    data: node.data,
    attrs: node.attrs,
    children: node.childNodes?.map(snapshot),
    content: node.content && snapshot(node.content),
  };
}

export async function formatHtml(source) {
  const document = parse(source, { sourceCodeLocationInfo: true });
  const preserved = [];
  let prefix = "QF";
  while (source.includes(prefix)) prefix += "Q";

  function visit(node) {
    const text = node.nodeName === "#text";
    if (
      node.sourceCodeLocation &&
      (text || node.nodeName === "#comment" || preservedElements.has(node.tagName))
    ) {
      const { startOffset, endOffset } = node.sourceCodeLocation;
      const token = `${prefix}${preserved.length.toString(36)}Q`;
      preserved.push({
        startOffset,
        endOffset,
        placeholder: text ? token : `<!--${token}-->`,
        original: source.slice(startOffset, endOffset),
      });
      return;
    }
    for (const child of node.childNodes ?? []) visit(child);
    if (node.content) visit(node.content);
  }

  visit(document);
  let masked = source;
  for (const item of preserved.toSorted((a, b) => b.startOffset - a.startOffset)) {
    masked = masked.slice(0, item.startOffset) + item.placeholder + masked.slice(item.endOffset);
  }

  // Strict formatting keeps indentation inside tags, avoiding new text nodes
  // between React elements. Protect text and scripts from line wrapping too.
  let formatted = await format(masked, {
    parser: "html",
    htmlWhitespaceSensitivity: "strict",
    embeddedLanguageFormatting: "off",
    printWidth: 100,
    tabWidth: 2,
  });
  for (const item of preserved) {
    if (formatted.split(item.placeholder).length !== 2) {
      throw new Error("El formateador no pudo conservar el contenido del HTML.");
    }
    formatted = formatted.replace(item.placeholder, () => item.original);
  }
  formatted = formatted.trimEnd() + source.match(/\s*$/u)[0];

  if (!isDeepStrictEqual(snapshot(parse(source)), snapshot(parse(formatted)))) {
    throw new Error("El formato alteraría el DOM prerenderizado; se conserva el HTML original.");
  }
  return formatted;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = fileURLToPath(new URL("../build/client/", import.meta.url));
  const files = (await readdir(directory, { recursive: true }))
    .filter((file) => file.endsWith(".html"))
    .sort();
  for (const file of files) {
    const path = join(directory, file);
    await writeFile(path, await formatHtml(await readFile(path, "utf8")));
  }
  console.log(`HTML con sangría: ${files.length} archivos en build/client/.`);
}
