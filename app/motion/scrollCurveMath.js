import { motionConfig } from "./motionConfig.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function getCurveSettings(width, devicePixelRatio = 1) {
  const config = motionConfig.scrollCurve;
  const mobile = width < config.breakpoint;
  return {
    ...config,
    bend: mobile ? config.mobileBend : config.bend,
    pixelRatio: Math.min(devicePixelRatio, mobile ? config.mobilePixelRatio : config.pixelRatio),
  };
}

// Sólo se activa WebGL si puede reproducir exactamente el encuadre HTML.
export function parseObjectPosition(value) {
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 2) return null;
  const keywords = [
    { left: 0, center: 0.5, right: 1 },
    { top: 0, center: 0.5, bottom: 1 },
  ];
  const position = parts.map((part, index) => {
    if (Object.hasOwn(keywords[index], part)) return keywords[index][part];
    return /^-?\d+(?:\.\d+)?%$/.test(part) ? Number.parseFloat(part) / 100 : NaN;
  });
  return position.every(Number.isFinite) ? position : null;
}

export function getCoverUv(imageWidth, imageHeight, boxWidth, boxHeight, position) {
  if ([imageWidth, imageHeight, boxWidth, boxHeight].some((size) => !(size > 0))) return null;
  const imageAspect = imageWidth / imageHeight;
  const boxAspect = boxWidth / boxHeight;
  const scale = [Math.min(1, boxAspect / imageAspect), Math.min(1, imageAspect / boxAspect)];
  return {
    scale,
    offset: [(1 - scale[0]) * position[0], (1 - scale[1]) * (1 - position[1])],
  };
}

export function getEdgeInfluence(screenY, edgeStart = motionConfig.scrollCurve.edgeStart) {
  const progress = clamp((screenY - edgeStart) / (1 - edgeStart), 0, 1);
  const edge = progress * progress * (3 - 2 * progress);
  return edge * edge;
}

export function getTargetBend(base, speed, config = motionConfig.scrollCurve) {
  return base * (1 + clamp(Math.abs(speed) / config.speedLimit, 0, 1) * config.speedBoost);
}

export function advanceBend(current, target, delta, response = motionConfig.scrollCurve.response) {
  const next = current + (target - current) * (1 - Math.exp(-response * Math.max(0, delta)));
  return Math.abs(next - target) < 0.00001 ? target : next;
}
