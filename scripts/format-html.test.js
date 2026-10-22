import assert from "node:assert/strict";
import test from "node:test";
import { parse } from "parse5";
import { formatHtml } from "./format-html.js";

function nodes(node, name) {
  return [
    ...(node.nodeName === name ? [node] : []),
    ...(node.childNodes ?? []).flatMap((child) => nodes(child, name)),
    ...(node.content ? nodes(node.content, name) : []),
  ];
}

test("HTML gains indentation while keeping React text and suspense markers", async () => {
  const source =
    '<!DOCTYPE html><html lang="es"><head><title>Portfolio</title></head><body><main><p><strong>Modelaje.</strong> <!-- -->Texto con  dos espacios.</p><!--$?--><template id="B:0"></template><!--/$--><a href="/work"><span>W</span><span>o</span><span>r</span><span>k</span></a></main></body></html>';
  const formatted = await formatHtml(source);
  assert.ok(formatted.split("\n").length > 10);
  for (const name of ["#text", "#comment"]) {
    const values = (html) => nodes(parse(html), name).map((node) => node.value ?? node.data);
    assert.deepEqual(values(formatted), values(source));
  }
});

test("scripts and whitespace-sensitive elements remain byte-for-byte intact", async () => {
  const preserved =
    '<script>const value = `line 1\n    line 2`;window.payload = "$&";</script><pre>  línea 1\n línea 2  </pre><textarea>  borrador\n  </textarea><style>.x::before { content: "  "; }</style>';
  const source = `<!DOCTYPE html><html><head><title>Portfolio</title></head><body>${preserved}</body></html>`;
  const formatted = await formatHtml(source);
  for (const element of preserved.match(/<(script|pre|textarea|style)>[\s\S]*?<\/\1>/g)) {
    assert.ok(formatted.includes(element));
  }
});

test("formatting handles SVG and templates and is stable across repeated runs", async () => {
  const source =
    '<!DOCTYPE html><html><head><title>QF0Q</title></head><body><svg viewBox="0 0 20 20"><text x="0" y="10">Tu nombre</text><path d="M0 0L20 20"/></svg><template><span>Contenido pendiente</span></template></body></html>';
  const formatted = await formatHtml(source);
  assert.equal(await formatHtml(formatted), formatted);
});
