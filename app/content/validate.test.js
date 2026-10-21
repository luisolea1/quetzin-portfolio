import assert from "node:assert/strict";
import test from "node:test";
import { findProject, media, projects, site, validateContent } from "./index.js";
import { validate } from "./validate.js";

test("the six editable projects have valid references", () => {
  assert.equal(validateContent(), true);
  assert.equal(projects.filter((project) => project.featured).length, 4);
  assert.equal(findProject("missing"), undefined);
});

test("duplicate slugs are rejected", () => {
  const duplicate = structuredClone(projects);
  duplicate[1].slug = duplicate[0].slug;
  assert.throws(() => validate(site, duplicate, media), /duplicado/);
});

test("unknown media and broken mobile order are rejected", () => {
  const broken = structuredClone(projects);
  broken[0].hero = "unknown";
  assert.throws(() => validate(site, broken, media), /recurso inexistente/);
  broken[0].hero = projects[0].hero;
  broken[0].gallery[0].mobileOrder = [1, 1];
  assert.throws(() => validate(site, broken, media), /Orden móvil/);
});

test("unsafe editable links and repeated related projects are rejected", () => {
  const broken = structuredClone(projects);
  broken[0].url = "javascript:alert(1)";
  assert.throws(() => validate(site, broken, media), /enlace inválido/);
  broken[0].url = null;
  broken[0].related = ["project02", "project02"];
  assert.throws(() => validate(site, broken, media), /relacionados inválidos/);
});
