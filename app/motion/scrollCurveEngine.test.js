import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { createScrollCurveEngine } from "./scrollCurveEngine.js";

// Adaptadores DOM/GPU controlados: prueban el relevo y la liberación de recursos,
// incluidos errores que no dependen de que el equipo de CI disponga de WebGL.
function fixture(
  t,
  { textureFails = false, delayed = false, renderFails = false, shaderFails = false } = {},
) {
  const names = ["window", "document", "getComputedStyle", "ResizeObserver", "MutationObserver"];
  const originals = names.map((name) => Object.getOwnPropertyDescriptor(globalThis, name));
  t.after(() => {
    engine?.dispose();
    names.forEach((name, i) => {
      if (originals[i]) Object.defineProperty(globalThis, name, originals[i]);
      else delete globalThis[name];
    });
  });
  const canvases = new Set();
  const observers = [];
  const reveal = { dataset: { revealState: "done" } };
  const rect = { left: 50, top: 500, width: 500, height: 500, bottom: 1000 };
  const body = { appendChild: (canvas) => canvases.add(canvas) };
  const surface = {
    parentElement: body,
    attributes: new Map(),
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
    removeAttribute(name) {
      this.attributes.delete(name);
    },
  };
  const image = Object.assign(new EventTarget(), {
    src: "/image.webp",
    currentSrc: "/image.webp",
    complete: true,
    naturalWidth: 1000,
    naturalHeight: 2000,
    isConnected: true,
    closest: () => reveal,
    getBoundingClientRect: () => rect,
  });
  globalThis.window = Object.assign(new EventTarget(), {
    innerWidth: 1440,
    innerHeight: 900,
    devicePixelRatio: 2,
    scrollY: 0,
  });
  globalThis.document = Object.assign(new EventTarget(), {
    body,
    documentElement: { clientWidth: 1440 },
    hidden: false,
  });
  globalThis.getComputedStyle = (element) =>
    element === image
      ? { objectFit: "cover", objectPosition: "50% 70%", visibility: "visible" }
      : {
          borderTopLeftRadius: "7px",
          borderTopRightRadius: "7px",
          borderBottomLeftRadius: "7px",
          borderBottomRightRadius: "7px",
          transform: "none",
          filter: "none",
          opacity: "1",
        };
  class Observer {
    constructor(callback) {
      this.callback = callback;
      observers.push(this);
    }
    observe() {}
    disconnect() {
      this.disconnected = true;
    }
  }
  globalThis.MutationObserver = Observer;
  globalThis.ResizeObserver = Observer;
  window.ResizeObserver = Observer;
  let renderer;
  let load;
  let textureDisposed = 0;
  const texture = new THREE.Texture();
  texture.addEventListener("dispose", () => textureDisposed++);
  class Renderer {
    constructor() {
      renderer = this;
      this.debug = {};
      this.draws = this.clears = this.disposals = this.losses = 0;
      this.domElement = Object.assign(new EventTarget(), {
        setAttribute() {},
        remove() {
          canvases.delete(this);
        },
      });
    }
    setClearColor() {}
    setPixelRatio(value) {
      this.pixelRatio = value;
    }
    setSize() {}
    initTexture() {}
    getContext() {
      return { isContextLost: () => false };
    }
    render(scene) {
      if (renderFails) throw new Error("GPU draw failed");
      if (shaderFails) {
        this.debug.onShaderError();
        return;
      }
      this.draws++;
      this.scene = scene;
    }
    clear() {
      this.clears++;
    }
    dispose() {
      this.disposals++;
    }
    forceContextLoss() {
      this.losses++;
    }
  }
  class Loader {
    load(src, success, progress, failure) {
      load = () => (textureFails ? failure(new Error("CORS")) : success(texture));
      if (!delayed) load();
    }
  }
  let frame;
  let subscribers = 0;
  const failures = [];
  const engine = createScrollCurveEngine({
    targets: new Map([[image, surface]]),
    subscribeFrame(callback) {
      subscribers++;
      frame = callback;
      return () => {
        subscribers--;
      };
    },
    canvasClassName: "test-canvas",
    onFailure: (error) => failures.push(error),
    three: { ...THREE, WebGLRenderer: Renderer, TextureLoader: Loader },
  });
  return {
    engine,
    image,
    surface,
    renderer,
    rect,
    reveal,
    observers,
    failures,
    canvases,
    tick: (scroll = 0) => frame({ delta: 1 / 60, scroll }),
    ready: () => surface.attributes.has("data-scroll-curve-ready"),
    load: () => load(),
    subscribers: () => subscribers,
    textureDisposed: () => textureDisposed,
  };
}

test("HTML waits for M01 and a successful frame, then GPU work stops when stable or hidden", (t) => {
  const f = fixture(t);
  f.reveal.dataset.revealState = "running";
  f.tick();
  assert.equal(f.ready(), false);
  assert.equal(f.renderer.draws, 0);
  f.reveal.dataset.revealState = "done";
  f.observers.forEach((observer) => observer.callback());
  f.tick();
  assert.equal(f.ready(), true);
  assert.equal(f.renderer.draws, 1);
  f.tick();
  assert.equal(f.renderer.draws, 1);
  document.hidden = true;
  f.tick(300);
  assert.equal(f.renderer.draws, 1);
  document.hidden = false;
  f.rect.top = 2000;
  f.rect.bottom = 2500;
  f.tick(400);
  assert.equal(f.ready(), false);
  assert.equal(f.renderer.clears, 1);
});

test("a failed texture keeps HTML visible without disabling the scroll runtime", (t) => {
  const f = fixture(t, { textureFails: true });
  f.tick();
  assert.equal(f.ready(), false);
  assert.equal(f.renderer.draws, 0);
  assert.equal(f.failures.length, 0);
  assert.equal(f.subscribers(), 1);
});

test("context loss restores HTML and releases the one renderer and its frame subscription", (t) => {
  const f = fixture(t);
  f.tick();
  const event = new Event("webglcontextlost", { cancelable: true });
  f.renderer.domElement.dispatchEvent(event);
  assert.equal(event.defaultPrevented, true);
  assert.equal(f.ready(), false);
  assert.equal(f.canvases.size, 0);
  assert.equal(f.subscribers(), 0);
  assert.equal(f.textureDisposed(), 1);
  assert.equal(f.renderer.disposals, 1);
  assert.equal(f.failures.length, 1);
  assert.ok(f.observers.every((observer) => observer.disconnected));
  f.engine.dispose();
  assert.equal(f.renderer.disposals, 1);
});

test("a GPU draw failure cannot hide the HTML image", (t) => {
  const f = fixture(t, { renderFails: true });
  f.tick();
  assert.equal(f.ready(), false);
  assert.equal(f.failures.length, 1);
  assert.equal(f.canvases.size, 0);
});

test("late textures are discarded after navigation disposes the engine", (t) => {
  const f = fixture(t, { delayed: true });
  f.engine.dispose();
  f.load();
  assert.equal(f.textureDisposed(), 1);
  assert.equal(f.ready(), false);
  assert.equal(f.subscribers(), 0);
  assert.equal(f.canvases.size, 0);
});

test("shader compilation failure restores HTML before any surface is hidden", (t) => {
  const f = fixture(t, { shaderFails: true });
  f.tick();
  assert.equal(f.ready(), false);
  assert.equal(f.failures.length, 1);
  assert.equal(f.subscribers(), 0);
  assert.equal(f.textureDisposed(), 1);
});
