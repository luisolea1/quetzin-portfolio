import { motionConfig } from "../motionConfig.js";

export class DeformationRenderer {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    Object.assign(this.canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "5",
    });
    document.body.append(this.canvas);
    this.context = this.canvas.getContext("2d");
    if (!this.context) {
      this.canvas.remove();
      throw new Error("Canvas 2D no disponible");
    }
    this.surfaces = new Set();
    this.lastScroll = window.scrollY;
    this.velocity = 0;
    this.frame = 0;
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
    this.visibility = this.visibility.bind(this);
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const surface of this.surfaces) {
            if (surface.element === entry.target) surface.visible = entry.isIntersecting;
          }
        }
        this.visibility();
      },
      { rootMargin: "100px" },
    );
    window.addEventListener("resize", this.resize);
    document.addEventListener("visibilitychange", this.visibility);
    this.resize();
    this.visibility();
  }

  resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(window.innerWidth * pixelRatio);
    this.canvas.height = Math.round(window.innerHeight * pixelRatio);
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  visibility() {
    if (document.hidden || ![...this.surfaces].some((surface) => surface.visible)) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    } else if (!this.frame) this.frame = requestAnimationFrame(this.render);
  }

  register(element, image = null) {
    if (!element || (image && !image.naturalWidth)) return () => {};
    const position = getComputedStyle(element)
      .getPropertyValue("--media-position")
      .trim()
      .split(/\s+/);
    const surface = {
      element,
      image,
      visible: false,
      horizontal: Number.parseFloat(position[0]),
      vertical: Number.parseFloat(position[1]),
    };
    this.surfaces.add(surface);
    this.observer.observe(element);
    return () => {
      this.observer.unobserve(element);
      this.surfaces.delete(surface);
      delete element.dataset.rendered;
      this.visibility();
    };
  }

  render() {
    this.frame = 0;
    if (document.hidden || ![...this.surfaces].some((surface) => surface.visible)) return;
    const { context, canvas } = this;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const delta = window.scrollY - this.lastScroll;
    this.velocity = this.velocity * 0.82 + Math.max(-45, Math.min(45, delta)) * 0.18;
    this.lastScroll = window.scrollY;

    for (const surface of this.surfaces) {
      const { element, image, visible, horizontal, vertical } = surface;
      if (!visible) continue;
      // M01 temporarily creates a stacking context. Keep the HTML image visible
      // during that entrance so the shared M05 canvas cannot cover its labels.
      if (element.closest('[data-deformation-paused="true"]')) {
        delete element.dataset.rendered;
        continue;
      }
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight || rect.width === 0) continue;
      const steps = Math.max(24, Math.ceil(rect.height / 9));
      const slice = rect.height / steps;
      const strength = Math.min(motionConfig.bendStrength, Math.abs(this.velocity) * 1.7);
      const scale = image
        ? Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
        : 1;
      const sourceWidth = image ? rect.width / scale : 0;
      const sourceHeight = image ? rect.height / scale : 0;
      const sourceX = image
        ? (image.naturalWidth - sourceWidth) *
          (Number.isFinite(horizontal) ? horizontal / 100 : 0.5)
        : 0;
      const sourceY = image
        ? (image.naturalHeight - sourceHeight) * (Number.isFinite(vertical) ? vertical / 100 : 0.5)
        : 0;

      try {
        for (let index = 0; index < steps; index++) {
          const progress = (index + 0.5) / steps;
          const bend = strength * Math.sin(progress * Math.PI) * (this.velocity < 0 ? -1 : 1);
          const top = rect.top + index * slice;
          if (image) {
            context.drawImage(
              image,
              sourceX,
              sourceY + progress * sourceHeight - sourceHeight / (2 * steps),
              sourceWidth,
              sourceHeight / steps,
              rect.left - bend,
              top,
              rect.width + 2 * bend,
              slice + 1,
            );
          } else {
            context.fillStyle = "#111111";
            context.fillRect(rect.left - bend, top, rect.width + 2 * bend, slice + 1);
          }
        }
        if (image && element.dataset.rendered !== "true") element.dataset.rendered = "true";
      } catch {
        delete element.dataset.rendered;
        this.observer.unobserve(element);
        this.surfaces.delete(surface);
      }
    }
    this.frame = requestAnimationFrame(this.render);
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("visibilitychange", this.visibility);
    this.observer.disconnect();
    for (const { element } of this.surfaces) delete element.dataset.rendered;
    this.surfaces.clear();
    this.canvas.remove();
  }
}
