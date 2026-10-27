// Motor de FoldText, adaptado de React Bits. Se importa sólo en el navegador.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HINGES = {
  top: { origin: "50% 0%", axis: "rotateX", sign: -1 },
  bottom: { origin: "50% 100%", axis: "rotateX", sign: 1 },
  left: { origin: "0% 50%", axis: "rotateY", sign: 1 },
  right: { origin: "100% 50%", axis: "rotateY", sign: -1 },
};
const SLATS = {
  rotateX: {
    origins: ["50% 25%", "50% 75%"],
    clips: ["inset(-40% -20% 50% -20%)", "inset(50% -20% -40% -20%)"],
  },
  rotateY: {
    origins: ["25% 50%", "75% 50%"],
    clips: ["inset(-40% 50% -40% -20%)", "inset(-40% -20% -40% 50%)"],
  },
};
const SLAT_DELAY = 0.24;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createFoldTextMotion(root, options) {
  gsap.registerPlugin(ScrollTrigger);
  const {
    hinge,
    foldStyle,
    duration,
    stagger,
    staggerFrom,
    foldAngle,
    ease,
    creaseShading,
    trigger,
    loopDelay,
    hoverRefold,
    refoldRadius,
    refoldAngle,
  } = options;
  const { axis, sign, origin } = HINGES[hinge];
  const slats = SLATS[axis];
  const unfoldEase = gsap.parseEase(ease) || gsap.parseEase("power3.out");
  const foldEase = gsap.parseEase("power2.in");
  const angle = foldStyle === "flip" ? 180 : foldAngle;
  const lift = foldStyle === "flip" ? 0.45 : 0;
  const refold =
    hoverRefold && window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ? refoldAngle
      : 0;
  const pieces = Array.from(root.querySelectorAll("[data-fold-piece]")).map((element) => {
    const parts = foldStyle === "blinds" ? Array.from(element.children) : [element];
    if (foldStyle === "blinds") {
      element.style.opacity = "1";
      parts.forEach((part, index) => {
        part.style.transformOrigin = slats.origins[index];
        if (index > 0) part.style.clipPath = slats.clips[index];
      });
    } else {
      element.style.transformOrigin = foldStyle === "flip" ? "50% 50%" : origin;
      element.style.backfaceVisibility = foldStyle === "flip" ? "visible" : "";
    }
    return { element, parts, t: trigger === "hover" ? 1 : 0, f: 0, r: 0, aim: 0 };
  });
  const shade = (progress, tilt) => String(creaseShading * clamp(1 - progress + tilt / 90, 0, 1));
  const render = () => {
    for (const piece of pieces) {
      const tilt = piece.r * refold;
      if (foldStyle === "blinds") {
        let resting = tilt < 0.05;
        piece.parts.forEach((part, index) => {
          const offset = index * SLAT_DELAY;
          const open = unfoldEase(clamp((piece.t - offset) / (1 - SLAT_DELAY), 0, 1));
          const close = foldEase(clamp((piece.f - offset) / (1 - SLAT_DELAY), 0, 1));
          const progress = open * (1 - close);
          if (Math.abs(1 - progress) > 0.002) resting = false;
          part.style.transform = `${axis}(${sign * ((1 - progress) * angle + tilt)}deg)`;
          part.style.opacity = String(clamp(progress, 0, 1));
          part.style.setProperty("--fold-crease", shade(progress, tilt));
        });
        piece.parts[0].style.clipPath = resting ? "none" : slats.clips[0];
        piece.parts[1].style.visibility = resting ? "hidden" : "visible";
        continue;
      }
      const progress = unfoldEase(piece.t) * (1 - foldEase(piece.f));
      const rise = lift * Math.sin(Math.PI * clamp(progress, 0, 1));
      const turn = `${axis}(${sign * ((1 - progress) * angle + tilt)}deg)`;
      piece.element.style.transform = rise > 0.001 ? `translateZ(${rise}em) ${turn}` : turn;
      piece.element.style.opacity = String(clamp(progress, 0, 1));
      piece.element.style.setProperty("--fold-crease", shade(progress, tilt));
    }
  };

  let timeline;
  let scrollTrigger;
  let disposed = false;
  let pointer = null;
  let centers;
  let measured;
  let relaxing = false;
  const initialRect = root.getBoundingClientRect();
  let visible = initialRect.bottom > 0 && initialRect.top < window.innerHeight;
  const active = () => visible && !document.hidden && !disposed;
  const measure = (box) => {
    centers = pieces.map((piece) => {
      const rect = piece.element.parentElement.getBoundingClientRect();
      return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2 };
    });
    measured = { width: box.width, height: box.height };
  };
  const relax = (time, deltaTime) => {
    if (!active()) {
      gsap.ticker.remove(relax);
      relaxing = false;
      return;
    }
    const step = Math.min(deltaTime, 64) / 1000;
    let moving = false;
    for (const piece of pieces) {
      const rate = piece.aim > piece.r ? 14 : 6;
      piece.r += (piece.aim - piece.r) * (1 - Math.exp(-rate * step));
      if (Math.abs(piece.aim - piece.r) > 0.001) moving = true;
      else piece.r = piece.aim;
    }
    render();
    if (!moving) {
      gsap.ticker.remove(relax);
      relaxing = false;
    }
  };
  const aim = () => {
    if (!active()) return;
    const box = root.getBoundingClientRect();
    const near =
      pointer &&
      pointer.x > box.left - refoldRadius &&
      pointer.x < box.right + refoldRadius &&
      pointer.y > box.top - refoldRadius &&
      pointer.y < box.bottom + refoldRadius;
    if (
      near &&
      (!centers ||
        Math.abs(box.width - measured.width) + Math.abs(box.height - measured.height) > 1)
    )
      measure(box);
    let changed = false;
    pieces.forEach((piece, index) => {
      let value = 0;
      if (near) {
        const center = centers[index];
        const distance =
          Math.hypot(box.left + center.x - pointer.x, box.top + center.y - pointer.y) /
          refoldRadius;
        if (distance < 1) value = 1 - distance * distance * (3 - 2 * distance);
      }
      if (value !== piece.aim) changed = true;
      piece.aim = value;
    });
    if (changed && !relaxing) {
      relaxing = true;
      gsap.ticker.add(relax);
    }
  };
  const handleMove = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    pointer = { x: event.clientX, y: event.clientY };
    aim();
  };
  const handleLeave = () => {
    pointer = null;
    aim();
  };
  const handleScroll = () => {
    if (pointer) aim();
  };
  const updateActivity = () => {
    if (disposed) return;
    if (active()) timeline?.resume();
    else {
      timeline?.pause();
      pointer = null;
      for (const piece of pieces) {
        piece.r = 0;
        piece.aim = 0;
      }
      gsap.ticker.remove(relax);
      relaxing = false;
      render();
    }
  };
  const play = (loop) => {
    timeline?.kill();
    timeline = gsap.timeline({
      onUpdate: render,
      ...(loop ? { repeat: -1, repeatDelay: 0.35 } : {}),
    });
    timeline.fromTo(
      pieces,
      { t: 0, f: 0 },
      { t: 1, duration, ease: "none", stagger: { each: stagger, from: staggerFrom } },
    );
    if (loop)
      timeline.to(
        pieces,
        {
          f: 1,
          duration: duration * 0.75,
          ease: "none",
          stagger: { each: stagger, from: staggerFrom },
        },
        `+=${loopDelay}`,
      );
    render();
    updateActivity();
  };
  const handleEnter = () => play(false);
  const observer = window.IntersectionObserver
    ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        updateActivity();
      })
    : null;
  observer?.observe(root);
  document.addEventListener("visibilitychange", updateActivity);
  root.dataset.foldReady = "true";
  if (trigger === "hover") {
    render();
    root.addEventListener("mouseenter", handleEnter);
  } else if (trigger === "scroll") {
    render();
    scrollTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top 82%",
      once: true,
      onEnter: handleEnter,
    });
  } else play(trigger === "loop");
  if (refold) {
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);
  }
  const invalidate = () => {
    centers = null;
  };
  window.addEventListener("resize", invalidate, { passive: true });
  document.fonts?.ready.then(() => {
    if (!disposed) {
      invalidate();
      scrollTrigger?.refresh();
    }
  });

  return () => {
    disposed = true;
    observer?.disconnect();
    document.removeEventListener("visibilitychange", updateActivity);
    root.removeEventListener("mouseenter", handleEnter);
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("scroll", handleScroll, { capture: true });
    window.removeEventListener("resize", invalidate);
    document.documentElement.removeEventListener("pointerleave", handleLeave);
    gsap.ticker.remove(relax);
    scrollTrigger?.kill();
    timeline?.kill();
    gsap.killTweensOf(pieces);
  };
}
