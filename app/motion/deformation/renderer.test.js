import assert from "node:assert/strict";
import test from "node:test";
import { DeformationRenderer } from "./renderer.client.js";

test("HTML images remain visible during entrance and switch to canvas after drawing", (t) => {
  let intersect;
  let draws = 0;
  let paused = false;
  const context = {
    setTransform() {},
    clearRect() {},
    drawImage() {
      draws++;
    },
  };
  const canvas = {
    style: {},
    setAttribute() {},
    getContext: () => context,
    remove() {},
  };
  const globals = {
    window: {
      scrollY: 0,
      innerWidth: 1000,
      innerHeight: 800,
      addEventListener() {},
      removeEventListener() {},
    },
    document: {
      hidden: false,
      createElement: () => canvas,
      body: { append() {} },
      addEventListener() {},
      removeEventListener() {},
    },
    IntersectionObserver: class {
      constructor(callback) {
        intersect = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    getComputedStyle: () => ({ getPropertyValue: () => "50% 50%" }),
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
  };
  const previous = new Map();
  for (const [key, value] of Object.entries(globals)) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  let renderer;
  t.after(() => {
    renderer?.destroy();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });

  renderer = new DeformationRenderer();
  const element = {
    dataset: {},
    closest: () => (paused ? {} : null),
    getBoundingClientRect: () => ({ left: 0, top: 10, bottom: 210, width: 200, height: 200 }),
  };
  const unregister = renderer.register(element, { naturalWidth: 400, naturalHeight: 400 });
  assert.equal(element.dataset.rendered, undefined, "keep HTML until the first canvas frame");

  intersect([{ target: element, isIntersecting: true }]);
  renderer.render();
  assert.ok(draws > 0);
  assert.equal(element.dataset.rendered, "true");

  paused = true;
  const drawsBeforeEntrance = draws;
  renderer.render();
  assert.equal(draws, drawsBeforeEntrance, "avoid drawing above the animated labels");
  assert.equal(element.dataset.rendered, undefined, "restore the animated HTML image");

  paused = false;
  renderer.render();
  assert.ok(draws > drawsBeforeEntrance);
  assert.equal(element.dataset.rendered, "true", "resume deformation after the entrance");
  unregister();
  assert.equal(element.dataset.rendered, undefined);
});
