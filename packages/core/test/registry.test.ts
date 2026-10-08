import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  getIcon,
  getIconSvg,
  hasIcon,
  iconCategories,
  listIcons,
  parseViewBox,
  stripSvgWrapper,
} from "../src/index.js";
import { parseIconCategories } from "../scripts/validate-icon.js";

test("listIcons returns the bundled catalog", () => {
  const icons = listIcons();
  const names = icons.map((icon) => icon.name);

  assert.ok(names.includes("react"));
  assert.ok(names.includes("nextjs"));
  assert.deepEqual(names, [...names].sort());

  for (const icon of icons) {
    assert.equal(typeof icon.title, "string");
    assert.ok(icon.title.length > 0);
    assert.ok(iconCategories.includes(icon.category));
    assert.match(icon.variants.original, /^<svg\b/);
    assert.match(icon.variants.original, /viewBox=/);
    assert.equal(getIcon(icon.name), icon);
    assert.equal(getIcon(icon.name, "original")?.variants.original, icon.variants.original);
    assert.equal(getIconSvg(icon.name), icon.variants.original);
    assert.equal(getIconSvg(icon.name, "original"), icon.variants.original);
    assert.equal(hasIcon(icon.name), true);

    if (icon.variants.mono) {
      assert.match(icon.variants.mono, /currentColor/);
      assert.equal(getIconSvg(icon.name, "mono"), icon.variants.mono);
    }

    for (const alias of icon.aliases ?? []) {
      assert.notEqual(alias.toLowerCase(), icon.name);
      assert.equal(getIcon(alias)?.name, icon.name);
      assert.equal(hasIcon(alias), true);
    }
  }
});

test("getIcon resolves canonical names, aliases, and case", () => {
  assert.equal(getIcon("react")?.name, "react");
  assert.equal(getIcon("react")?.title, "React");
  assert.equal(getIcon("  ReAcT  ")?.name, "react");
  assert.equal(getIcon("reactjs")?.name, "react");
  assert.equal(getIcon("REACTJS")?.name, "react");
  assert.equal(getIcon("nextjs")?.name, "nextjs");
  assert.equal(getIcon("next")?.name, "nextjs");
  assert.equal(getIcon("Next.js")?.name, "nextjs");
  assert.equal(getIcon("nextjs", "mono")?.variants.mono?.includes("currentColor"), true);
});

test("getIcon and getIconSvg reject unknown names", () => {
  assert.equal(getIcon("not-a-real-icon"), undefined);
  assert.equal(getIcon(""), undefined);
  assert.equal(getIcon("   "), undefined);
  assert.equal(getIconSvg("not-a-real-icon"), undefined);
  assert.equal(getIconSvg("not-a-real-icon", "mono"), undefined);
  assert.equal(hasIcon("not-a-real-icon"), false);
  assert.equal(hasIcon(""), false);
  assert.equal(hasIcon("react"), true);
});

test("getIconSvg returns original and mono markup", () => {
  const original = getIconSvg("react", "original");
  const mono = getIconSvg("react", "mono");

  assert.equal(getIconSvg("react"), original);
  assert.match(original ?? "", /#61DAFB/);
  assert.match(mono ?? "", /currentColor/);
  assert.notEqual(original, mono);
  assert.equal(parseViewBox(original ?? ""), "0 0 24 24");
  assert.equal(stripSvgWrapper(original ?? "").includes("<svg"), false);
  assert.match(stripSvgWrapper(original ?? ""), /<ellipse/);
});

test("published category list matches src/categories.ts", () => {
  const source = readFileSync(new URL("../src/categories.ts", import.meta.url), "utf8");
  assert.deepEqual(parseIconCategories(source), [...iconCategories]);
});
