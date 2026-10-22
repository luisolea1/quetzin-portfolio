// Movimiento de React Bits Circular Carousel, adaptado para pausa y movimiento reducido.
// Fuente y licencia: licenses/react-bits-LICENSE.md y README.md.

export const INTRO_LENGTH = { assemble: 1500, rise: 1400, spin: 1800, none: 0 };
const SPRING = 118;
const SETTLE_SPEED = 9;

// No accede al DOM: permite comprobar el avance y la detención del único ciclo.
export function advanceCarousel(state, s, ready, dt, now) {
  const nearest = (angle) => Math.round(angle / s.step) * s.step;
  if (s.reduced) {
    state.angle = state.target ?? state.angle;
    state.target = null;
    state.velocity = 0;
    state.intro = null;
    state.introDone = true;
    state.yaw = state.pitch = 0;
    return false;
  }
  if (!state.introDone && ready) {
    if (!state.intro) {
      if (s.intro === "none") state.introDone = true;
      else state.intro = { type: s.intro, start: now };
    }
    if (state.intro && now - state.intro.start >= INTRO_LENGTH[state.intro.type]) {
      state.intro = null;
      state.introDone = true;
    }
  }

  const paused = (s.pauseOnHover && state.hover) || state.drag || now < state.holdUntil;
  const cruise = s.autoplay === "drift" && !paused && !state.intro ? s.speed * state.dir : 0;
  let busy = Boolean(state.intro) || state.drag;

  if (state.drag || state.intro) {
    state.velocity = state.drag ? state.velocity : 0;
  } else if (state.target !== null) {
    let remaining = dt;
    const damping = 2 * Math.sqrt(SPRING);
    while (remaining > 0) {
      const h = Math.min(remaining, 1 / 240);
      const accel = SPRING * (state.target - state.angle) - damping * state.velocity;
      state.velocity += accel * h;
      state.angle += state.velocity * h;
      remaining -= h;
    }
    if (Math.abs(state.target - state.angle) < 0.004 && Math.abs(state.velocity) < 0.03) {
      state.angle = state.target;
      state.velocity = 0;
      state.target = null;
    }
    busy = true;
  } else {
    const tau = 0.18 + s.momentum * 1.5;
    state.velocity += (cruise - state.velocity) * (1 - Math.exp(-dt / tau));
    state.angle += state.velocity * dt;
    if (
      cruise === 0 &&
      s.snap &&
      Math.abs(state.velocity) < SETTLE_SPEED &&
      Math.abs(nearest(state.angle) - state.angle) > 0.004
    ) {
      state.target = nearest(state.angle);
    }
    busy = busy || cruise !== 0 || Math.abs(state.velocity) > 0.01 || state.target !== null;
  }

  if (s.autoplay === "step" && !paused && !state.intro && state.introDone) {
    if (!state.stepAt) state.stepAt = now + s.interval * 1000;
    if (now >= state.stepAt) {
      state.target = (state.target ?? nearest(state.angle)) + s.step * state.dir;
      state.stepAt = now + s.interval * 1000;
    }
    busy = true;
  } else {
    state.stepAt = 0;
  }

  if (now < state.holdUntil) busy = true;

  const ease = 1 - Math.exp(-dt / 0.35);
  const aimYaw = state.pointer.inside ? state.pointer.x * s.parallax * 9 : 0;
  const aimPitch = state.pointer.inside ? -state.pointer.y * s.parallax * 6 : 0;
  state.yaw += (aimYaw - state.yaw) * ease;
  state.pitch += (aimPitch - state.pitch) * ease;
  if (Math.abs(aimYaw - state.yaw) > 0.01 || Math.abs(aimPitch - state.pitch) > 0.01) busy = true;

  return busy;
}
