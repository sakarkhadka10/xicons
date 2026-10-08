import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon } from "../dist/Icon.js";

function render(props) {
  return renderToStaticMarkup(createElement(Icon, props));
}

test("renders a known icon with svg attributes and the default variant", () => {
  const html = render({ name: "react" });

  assert.match(html, /^<span /);
  assert.match(html, /aria-hidden="true"/);
  assert.doesNotMatch(html, /role="img"/);
  assert.match(html, /<svg[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(html, /viewBox="0 0 24 24"/);
  assert.match(html, /width="100%"/);
  assert.match(html, /height="100%"/);
  assert.match(html, /#61DAFB/);
  assert.match(html, /display:inline-flex/);
});

test("resolves aliases and ignores case", () => {
  const canonical = render({ name: "react", variant: "original" });
  assert.equal(render({ name: "reactjs" }), canonical);
  assert.equal(render({ name: "  ReAcT  " }), canonical);
  assert.match(render({ name: "next.js", variant: "mono" }), /currentColor/);
});

test("renders original and mono variants", () => {
  const original = render({ name: "react", variant: "original" });
  const mono = render({ name: "react", variant: "mono" });

  assert.match(original, /#61DAFB/);
  assert.doesNotMatch(original, /currentColor/);
  assert.match(mono, /currentColor/);
  assert.doesNotMatch(mono, /#61DAFB/);
});

test("unknown icons render nothing", () => {
  assert.equal(render({ name: "not-a-real-icon" }), "");
  assert.equal(render({ name: "" }), "");
});

test("applies size, className, color, and style", () => {
  const sized = render({ name: "react", size: 32, className: "h-6 w-6" });
  assert.match(sized, /class="h-6 w-6"/);
  assert.match(sized, /width:32px/);
  assert.match(sized, /height:32px/);

  const length = render({ name: "react", size: "2rem" });
  assert.match(length, /width:2rem/);
  assert.match(length, /height:2rem/);

  const tinted = render({ name: "react", variant: "mono", color: "#112233" });
  assert.match(tinted, /currentColor/);
  assert.match(tinted, /color:#112233/);

  const originalTint = render({ name: "react", color: "#112233" });
  assert.match(originalTint, /#61DAFB/);
  assert.match(originalTint, /color:#112233/);

  const overridden = render({
    name: "react",
    size: 10,
    style: { width: "4rem" },
  });
  assert.match(overridden, /width:4rem/);
  assert.match(overridden, /height:10px/);
  assert.doesNotMatch(overridden, /width:10px/);
});

test("exposes an accessible name when title is set", () => {
  const html = render({ name: "nextjs", title: "Next.js" });
  assert.match(html, /role="img"/);
  assert.match(html, /aria-label="Next\.js"/);
  assert.doesNotMatch(html, /aria-hidden/);
});
