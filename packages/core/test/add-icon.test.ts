import assert from "node:assert/strict";
import { test } from "node:test";
import { normalize } from "../../../scripts/add-icon.js";
import { parseIcon } from "../../../scripts/build-ui-icons.js";
import { softenPath } from "../../../scripts/soften.js";

test("add-icon redraws any SVG in the house style", () => {
  const svg = normalize(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">' +
      '<path d="M0 0h48v48H0z" fill="none" stroke="none"/>' +
      '<path d="M8 24h32" stroke="#000" stroke-width="4" fill="none"/></svg>',
  );

  assert.match(svg, /viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"/);
  assert.match(svg, /<path [^>]*d="M4 12h16"\/><\/svg>/); // scaled to 24px, color + weight removed
  assert.doesNotThrow(() => parseIcon("x.svg", svg));
});

test("build rejects hard-coded colors so icons follow light/dark themes", () => {
  assert.throws(
    () => parseIcon("x.svg", '<svg viewBox="0 0 24 24"><path fill="#111" d="M0 0h1"/></svg>'),
    /breaks dark mode/,
  );
});

test("soft corners round line-line joins and leave curves alone", () => {
  assert.equal(softenPath("m6 9 6 6 6-6", 1), "M6 9L11.293 14.293Q12 15 12.707 14.293L18 9");
  // closed shapes soften the wrap-around corner too
  assert.equal(
    softenPath("M4 4h16v16H4z", 1),
    "M5 4L19 4Q20 4 20 5L20 19Q20 20 19 20L5 20Q4 20 4 19L4 5Q4 4 5 4Z",
  );
  assert.equal(softenPath("M12 2a10 10 0 1 0 0 20", 1), "M12 2A10 10 0 1 0 12 22");
});
