import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceBend,
  getCoverUv,
  getCurveSettings,
  getEdgeInfluence,
  getTargetBend,
  parseObjectPosition,
} from "./scrollCurveMath.js";

const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`);

test("cover UVs preserve the editable crop including the bottom-oriented product cover", () => {
  assert.deepEqual(parseObjectPosition("50% 70%"), [0.5, 0.7]);
  const portrait = getCoverUv(1000, 2000, 500, 500, [0.5, 0.7]);
  assert.deepEqual(portrait.scale, [1, 0.5]);
  close(portrait.offset[1], 0.15);
  const landscape = getCoverUv(2000, 1000, 500, 500, [0.25, 0.5]);
  assert.deepEqual(landscape, { scale: [0.5, 1], offset: [0.125, 0] });
  assert.equal(getCoverUv(0, 1000, 500, 500, [0.5, 0.5]), null);
  assert.deepEqual(parseObjectPosition("right top"), [1, 0]);
  assert.equal(parseObjectPosition("calc(50% + 2px) 50%"), null);
  assert.equal(parseObjectPosition("20px 30px"), null);
});

test("deformation starts in the lower viewport and increases smoothly towards its edge", () => {
  for (const y of [-1, 0, 0.48]) assert.equal(getEdgeInfluence(y), 0);
  close(getEdgeInfluence(0.74), 0.25);
  assert.equal(getEdgeInfluence(1), 1);
  assert.equal(getEdgeInfluence(2), 1);
  assert.ok(getEdgeInfluence(0.6) < getEdgeInfluence(0.9));
});

test("speed boost is direction independent, bounded and returns to its base", () => {
  close(getTargetBend(0.1, 0), 0.1);
  close(getTargetBend(0.1, 900), 0.1225);
  close(getTargetBend(0.1, -900), 0.1225);
  close(getTargetBend(0.1, 18000), 0.145);
  close(getTargetBend(0.04, 18000), 0.058);
  let current = 0.145;
  for (let i = 0; i < 120; i++) current = advanceBend(current, 0.1, 1 / 60);
  assert.equal(current, 0.1);
});

test("response does not depend on refresh rate and mobile changes at 810px", () => {
  let sixty = 0.1,
    oneTwenty = 0.1;
  for (let i = 0; i < 30; i++) sixty = advanceBend(sixty, 0.145, 1 / 60);
  for (let i = 0; i < 60; i++) oneTwenty = advanceBend(oneTwenty, 0.145, 1 / 120);
  close(sixty, oneTwenty);
  for (const width of [360, 390, 809]) {
    assert.equal(getCurveSettings(width, 3).bend, 0.04);
    assert.equal(getCurveSettings(width, 3).pixelRatio, 1);
  }
  for (const width of [810, 1024, 1440]) {
    assert.equal(getCurveSettings(width, 3).bend, 0.05);
    assert.equal(getCurveSettings(width, 3).pixelRatio, 1.5);
  }
  assert.equal(getCurveSettings(1440, 1).pixelRatio, 1);
});
