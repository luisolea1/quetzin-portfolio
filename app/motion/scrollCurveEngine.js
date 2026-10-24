import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";
import {
  advanceBend,
  getCoverUv,
  getCurveSettings,
  getTargetBend,
  parseObjectPosition,
} from "./scrollCurveMath.js";
import { fragmentShader, vertexShader } from "./scrollCurveShaders.js";

const defaultThree = {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
};

// Un renderizador y una geometría para todas las superficies registradas.
// El proveedor de movimiento llama a tick después de avanzar Lenis.
export function createScrollCurveEngine({
  targets,
  subscribeFrame,
  canvasClassName,
  onFailure,
  three = defaultThree,
}) {
  const renderer = new three.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  const canvas = renderer.domElement;
  canvas.className = canvasClassName;
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("data-scroll-curve-canvas", "");
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = three.SRGBColorSpace;

  const scene = new three.Scene();
  const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;
  const geometry = new three.PlaneGeometry(1, 1, 24, 40);
  const loader = new three.TextureLoader();
  const entries = [];
  let width = 1;
  let height = 1;
  let settings;
  let bend = 0;
  let previousScroll = window.scrollY;
  let dirty = true;
  let drawn = false;
  let disposed = false;
  let unsubscribe = () => {};

  const invalidate = () => {
    dirty = true;
  };
  const setReady = (entry, ready) => {
    if (entry.ready === ready) return;
    entry.ready = ready;
    if (ready) entry.surface.setAttribute("data-scroll-curve-ready", "");
    else entry.surface.removeAttribute("data-scroll-curve-ready");
  };
  const restore = (entry) => setReady(entry, false);

  function removeVisual(entry) {
    restore(entry);
    if (entry.mesh) scene.remove(entry.mesh);
    entry.material?.dispose();
    entry.texture?.dispose();
    entry.mesh = entry.material = entry.texture = null;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    unsubscribe();
    resizeObserver?.disconnect();
    mutationObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("resize", resize);
    window.visualViewport?.removeEventListener("resize", resize);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    for (const entry of entries) {
      entry.version += 1;
      entry.image.removeEventListener("load", entry.onLoad);
      entry.image.removeEventListener("error", entry.onError);
      removeVisual(entry);
    }
    geometry.dispose();
    renderer.dispose();
    if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
    canvas.remove();
  }

  function fail(error) {
    if (disposed) return;
    dispose();
    onFailure(error);
  }

  function onContextLost(event) {
    event.preventDefault();
    fail(new Error("Se perdió el contexto WebGL; se conserva el respaldo HTML."));
  }

  function resize() {
    if (disposed) return;
    try {
      width = document.documentElement.clientWidth;
      height = window.innerHeight;
      settings = getCurveSettings(window.innerWidth, window.devicePixelRatio || 1);
      bend = settings.bend;
      renderer.setPixelRatio(settings.pixelRatio);
      renderer.setSize(width, height);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      invalidate();
    } catch (error) {
      fail(error);
    }
  }

  function refresh(entry) {
    if (disposed) return;
    const { image } = entry;
    const source = image.currentSrc || image.src;
    if (entry.source === source && image.complete && image.naturalWidth) return;
    const version = ++entry.version;
    removeVisual(entry);
    entry.source = "";
    invalidate();
    if (!source || !image.complete || !image.naturalWidth) return;
    entry.source = source;
    loader.load(
      source,
      (texture) => {
        if (disposed || version !== entry.version || !image.isConnected) {
          texture.dispose();
          return;
        }
        texture.colorSpace = three.SRGBColorSpace;
        try {
          renderer.initTexture(texture);
        } catch {
          texture.dispose();
          return;
        }
        entry.texture = texture;
        entry.material = new three.ShaderMaterial({
          vertexShader,
          fragmentShader,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          uniforms: {
            uImage: { value: texture },
            uViewport: { value: new three.Vector2(width, height) },
            uBoxSize: { value: new three.Vector2(1, 1) },
            uUvScale: { value: new three.Vector2(1, 1) },
            uUvOffset: { value: new three.Vector2() },
            uRadius: { value: 0 },
            uBend: { value: bend },
            uEdgeStart: { value: settings.edgeStart },
          },
        });
        entry.mesh = new three.Mesh(geometry, entry.material);
        entry.mesh.frustumCulled = false;
        entry.mesh.visible = false;
        scene.add(entry.mesh);
        invalidate();
      },
      undefined,
      invalidate,
    );
  }

  function measure(entry) {
    const { image, surface } = entry;
    if (!image.isConnected) return null;
    const reveal = image.closest("[data-reveal-state]");
    if (reveal && reveal.dataset.revealState !== "done") return null;
    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height || rect.bottom <= -100 || rect.top >= height + 100) return null;
    const imageStyle = getComputedStyle(image);
    if (imageStyle.objectFit !== "cover" || imageStyle.visibility === "hidden") return null;
    const position = parseObjectPosition(imageStyle.objectPosition);
    if (!position) return null;
    const surfaceStyle = getComputedStyle(surface);
    const radius = surfaceStyle.borderTopLeftRadius;
    if (
      !/^\d+(?:\.\d+)?px$/.test(radius) ||
      [
        surfaceStyle.borderTopRightRadius,
        surfaceStyle.borderBottomRightRadius,
        surfaceStyle.borderBottomLeftRadius,
      ].some((value) => value !== radius)
    )
      return null;
    for (
      let ancestor = surface;
      ancestor && ancestor !== document.body;
      ancestor = ancestor.parentElement
    ) {
      const style = getComputedStyle(ancestor);
      if (
        style.transform !== "none" ||
        style.filter !== "none" ||
        Number(style.opacity) !== 1 ||
        style.visibility === "hidden"
      )
        return null;
    }
    const uv = getCoverUv(
      image.naturalWidth,
      image.naturalHeight,
      rect.width,
      rect.height,
      position,
    );
    return uv ? { rect, uv, radius: Number.parseFloat(radius) } : null;
  }

  function tick({ delta, scroll }) {
    if (disposed) return;
    if (document.hidden) {
      previousScroll = scroll;
      return;
    }
    const moved = scroll !== previousScroll;
    const speed = Math.abs(scroll - previousScroll) / Math.max(delta, 0.001);
    previousScroll = scroll;
    const target = getTargetBend(settings.bend, speed, settings);
    const next = advanceBend(bend, target, delta, settings.response);
    if (!dirty && !moved && next === bend) return;
    bend = next;
    dirty = false;
    try {
      const visible = [];
      for (const entry of entries) {
        if (!entry.mesh) continue;
        const box = measure(entry);
        entry.mesh.visible = Boolean(box);
        if (!box) {
          restore(entry);
          continue;
        }
        const { rect, uv, radius } = box;
        entry.mesh.position.set(
          rect.left + rect.width / 2 - width / 2,
          height / 2 - rect.top - rect.height / 2,
          0,
        );
        entry.mesh.scale.set(rect.width, rect.height, 1);
        const uniforms = entry.material.uniforms;
        uniforms.uViewport.value.set(width, height);
        uniforms.uBoxSize.value.set(rect.width, rect.height);
        uniforms.uUvScale.value.set(...uv.scale);
        uniforms.uUvOffset.value.set(...uv.offset);
        uniforms.uRadius.value = radius;
        uniforms.uBend.value = bend;
        visible.push(entry);
      }
      if (visible.length) {
        renderer.render(scene, camera);
        // Un error de shader puede invocar fail() durante render().
        if (disposed) return;
        for (const entry of visible) setReady(entry, true);
        drawn = true;
      } else if (drawn) {
        renderer.clear();
        drawn = false;
      }
    } catch (error) {
      fail(error);
    }
  }

  function onVisibility() {
    previousScroll = window.scrollY;
    invalidate();
  }
  const resizeObserver = window.ResizeObserver ? new ResizeObserver(invalidate) : null;
  const mutationObserver = new MutationObserver(() => {
    for (const entry of entries) refresh(entry);
    invalidate();
  });
  renderer.debug.onShaderError = () =>
    fail(new Error("No se pudo compilar el shader de curvatura."));
  canvas.addEventListener("webglcontextlost", onContextLost);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("resize", resize);
  window.visualViewport?.addEventListener("resize", resize);
  document.body.appendChild(canvas);
  resize();
  if (disposed) return { dispose };
  for (const [image, surface] of targets) {
    const entry = { image, surface, source: "", version: 0, mesh: null };
    entry.onLoad = () => refresh(entry);
    entry.onError = () => {
      ++entry.version;
      removeVisual(entry);
      invalidate();
    };
    image.addEventListener("load", entry.onLoad);
    image.addEventListener("error", entry.onError);
    entries.push(entry);
    resizeObserver?.observe(surface);
    mutationObserver.observe(image, {
      attributes: true,
      attributeFilter: ["src", "srcset", "sizes"],
    });
    const reveal = image.closest("[data-reveal-state]");
    if (reveal)
      mutationObserver.observe(reveal, {
        attributes: true,
        attributeFilter: ["data-reveal-state"],
      });
    refresh(entry);
  }
  document.fonts?.ready.then(() => {
    if (!disposed) invalidate();
  });
  unsubscribe = subscribeFrame(tick);
  return { dispose };
}
