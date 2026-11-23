import assert from "node:assert/strict";
import { test } from "node:test";
import { toSvg, type IconData } from "../src/index.js";

test("toSvg merges defaults, icon root and overrides, escaping values", () => {
  const icon: IconData = [{ "stroke-width": "1.5" }, [["circle", { cx: "12", cy: "12", r: "3" }]]];
  const svg = toSvg(icon, { class: 'size-4 "x"', "stroke-width": 1 });

  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="24"/);
  assert.match(svg, /stroke-width="1"/);
  assert.match(svg, /class="size-4 &quot;x&quot;"/);
  assert.match(svg, /<circle cx="12" cy="12" r="3"\/><\/svg>$/);
});

test("built barrel exports every icon as tree-shakable data", async () => {
  const barrel = (await import("../dist/icons.js" as string)) as Record<string, IconData>;
  assert.ok(Object.keys(barrel).length > 10_000);
  assert.equal(barrel.IconHome, barrel.IconHouse); // aliases re-export the same data
  assert.match(toSvg(barrel.IconCamera!), /^<svg[^>]+stroke="currentColor"[^>]*><path d="/);
  // fill-based styles must not inherit the default stroke
  assert.match(toSvg(barrel.IconCameraFilled!), /fill="currentColor" stroke="none"/);
});
