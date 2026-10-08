import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getIcon,
  getIconSvg,
  hasIcon,
  listIcons,
} from "../dist/registry.js";
import { parseViewBox, stripSvgWrapper } from "../dist/svg.js";

test("listIcons returns all bundled icons", () => {
  assert.ok(listIcons().length >= 2);
});

test("getIcon resolves canonical names", () => {
  assert.ok(getIcon("react")?.variants.original);
  assert.ok(getIcon("nextjs")?.variants.original);
});

test("getIcon resolves aliases", () => {
  assert.equal(getIcon("reactjs")?.name, "react");
  assert.equal(getIcon("next")?.name, "nextjs");
});

test("getIconSvg returns mono variant", () => {
  const svg = getIconSvg("react", "mono");
  assert.match(svg ?? "", /currentColor/);
});

test("hasIcon works for unknown icons", () => {
  assert.equal(hasIcon("react"), true);
  assert.equal(hasIcon("not-a-real-icon"), false);
});

test("svg helpers preserve viewBox and inner markup", () => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12"/></svg>';
  assert.equal(parseViewBox(svg), "0 0 24 24");
  assert.equal(stripSvgWrapper(svg), '<circle cx="12"/>');
});
