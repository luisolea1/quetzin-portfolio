import assert from "node:assert/strict";
import test from "node:test";
import { advanceCarousel } from "./circularCarouselMotion.js";

function fixture(overrides = {}) {
  return {
    state: {
      angle: 0,
      velocity: 0,
      target: null,
      dir: -1,
      intro: null,
      introDone: true,
      hover: false,
      drag: false,
      holdUntil: 0,
      stepAt: 0,
      yaw: 0,
      pitch: 0,
      pointer: { inside: false, x: 0, y: 0 },
    },
    settings: {
      reduced: false,
      intro: "none",
      autoplay: "drift",
      speed: 14,
      step: 45,
      interval: 3,
      pauseOnHover: true,
      momentum: 0.6,
      snap: true,
      parallax: 0.3,
      ...overrides,
    },
  };
}

function runFrames(state, settings, count) {
  let busy;
  for (let frame = 1; frame <= count; frame++) {
    busy = advanceCarousel(state, settings, true, 1 / 60, 10000 + frame * (1000 / 60));
    assert.ok(Number.isFinite(state.angle) && Number.isFinite(state.velocity));
  }
  return busy;
}

test("reduced motion stops an ongoing intro and resolves keyboard navigation immediately", () => {
  const { state, settings } = fixture({ reduced: true });
  Object.assign(state, {
    angle: 27,
    target: -90,
    velocity: 85,
    intro: { type: "rise", start: 10000 },
    introDone: false,
    yaw: 6,
    pitch: 4,
  });
  assert.equal(runFrames(state, settings, 1), false);
  assert.equal(state.angle, -90);
  assert.equal(state.velocity, 0);
  assert.equal(state.target, null);
  assert.equal(state.intro, null);
  assert.equal(state.yaw, 0);
  assert.equal(state.pitch, 0);
  assert.equal(runFrames(state, settings, 120), false);
  assert.equal(state.angle, -90);
});

test("a full drift rotation can pause, settle without an endless loop and resume", () => {
  const { state, settings } = fixture();
  state.velocity = -settings.speed;
  runFrames(state, settings, Math.round((360 / settings.speed) * 60));
  assert.ok(Math.abs(state.angle + 360) < 0.25);

  settings.autoplay = "off";
  assert.equal(runFrames(state, settings, 600), false);
  const restingAngle = state.angle;
  assert.ok(
    Math.abs(restingAngle / settings.step - Math.round(restingAngle / settings.step)) < 0.001,
  );
  assert.equal(runFrames(state, settings, 60), false);
  assert.equal(state.angle, restingAngle);

  settings.autoplay = "drift";
  assert.equal(runFrames(state, settings, 120), true);
  assert.ok(state.angle < restingAngle - 10);
});

test("previous and next targets settle on the requested card while paused", () => {
  const { state, settings } = fixture({ autoplay: "off" });
  for (const target of [-45, 0, -315]) {
    state.target = target;
    assert.equal(runFrames(state, settings, 240), false);
    assert.equal(state.angle, target);
    assert.equal(state.target, null);
  }
});
