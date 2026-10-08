import assert from "node:assert/strict";
import { test } from "node:test";
import { escapeXml, parseViewBox, stripSvgWrapper } from "../dist/index.js";

test("parseViewBox reads double quotes, single quotes, and the fallback", () => {
  assert.equal(
    parseViewBox('<svg viewBox="0 0 24 24"></svg>'),
    "0 0 24 24",
  );
  assert.equal(
    parseViewBox("<svg viewBox='0 0 32 32'></svg>"),
    "0 0 32 32",
  );
  assert.equal(parseViewBox("<svg></svg>"), "0 0 24 24");
  assert.equal(parseViewBox("<svg></svg>", "0 0 16 16"), "0 0 16 16");
  assert.equal(parseViewBox("0 0 24 24"), "0 0 24 24");
});

test("stripSvgWrapper removes only the outer svg element", () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12"/>
</svg>
`;
  assert.equal(stripSvgWrapper(svg), '\n  <circle cx="12"/>\n');
});

test("escapeXml escapes markup characters", () => {
  assert.equal(escapeXml(`<>&"`), "&lt;&gt;&amp;&quot;");
  assert.equal(escapeXml("Next.js"), "Next.js");
  assert.equal(escapeXml("a & b"), "a &amp; b");
});
