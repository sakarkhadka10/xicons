import assert from "node:assert/strict";
import { test } from "node:test";
import { renderIcons } from "../src/renderer.js";

test("composes known names and aliases into one svg", () => {
  const svg = renderIcons({
    names: ["reactjs", "next"],
    size: 32,
    gap: 8,
  });

  assert.match(svg, /^<\?xml/);
  assert.match(svg, /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /width="72"/);
  assert.match(svg, /height="32"/);
  assert.match(svg, /viewBox="0 0 72 32"/);
  assert.match(svg, /aria-label="React"/);
  assert.match(svg, /aria-label="Next\.js"/);
  assert.match(svg, /#252F3E/i);
});

test("draws the original variant when requested", () => {
  const svg = renderIcons({
    names: ["react"],
    variant: "original",
    size: 32,
    gap: 0,
  });

  assert.match(svg, /#61DAFB/i);
  assert.doesNotMatch(svg, /#252F3E/i);
});

test("draws the mono variant and skips unknown names", () => {
  const svg = renderIcons({
    names: ["missing", "react", "also-missing"],
    variant: "mono",
    size: 16,
    gap: 0,
  });

  assert.match(svg, /width="16"/);
  assert.match(svg, /currentColor/);
  assert.doesNotMatch(svg, /#61DAFB/i);
  assert.doesNotMatch(svg, /missing/);
});

test("returns a 1x1 svg when nothing resolves", () => {
  const svg = renderIcons({ names: ["nope"] });
  assert.match(svg, /width="1"/);
  assert.match(svg, /height="1"/);
  assert.match(svg, /viewBox="0 0 1 1"/);
  assert.equal(renderIcons({ names: [] }), svg);
});

test("renders UI icons by name, keeping their root stroke attributes", () => {
  const svg = renderIcons({
    names: ["camera", "react"],
    size: 24,
    gap: 4,
    color: "e4e4e7",
  });

  assert.match(svg, /viewBox="0 0 52 24" color="#e4e4e7"/);
  assert.match(
    svg,
    /<svg [^>]*stroke="currentColor"[^>]*x="0" y="0" width="24" height="24" aria-label="camera">/,
  );
  assert.match(svg, /aria-label="React"/);
});

test("ignores unsafe color values", () => {
  const svg = renderIcons({ names: ["camera"], color: '"/><script>' });
  assert.doesNotMatch(svg, /script|color=/);
});
