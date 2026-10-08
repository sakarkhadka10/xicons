import assert from "node:assert/strict";
import { register } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { IconProps } from "../src/Icon.js";

register(new URL("./svg-mock-loader.ts", import.meta.url));

const { Icon } = await import("../src/Icon.js");

function render(props: IconProps): string {
  return renderToStaticMarkup(createElement(Icon, props));
}

function host(html: string): string {
  return html.match(/<xicons-svg\b[^>]*>/)?.[0] ?? "";
}

test("renders a known icon at the default size", () => {
  const html = render({ name: "react" });
  const tag = host(html);

  assert.match(tag, /width="24"/);
  assert.match(tag, /height="24"/);
  assert.match(html, /#61DAFB/);
  assert.match(html, /viewBox/);
});

test("resolves aliases", () => {
  assert.match(render({ name: "reactjs" }), /#61DAFB/);
  assert.match(render({ name: "NEXT" }), /#000000/);
  assert.match(render({ name: "next.js" }), /#000000/);
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
});

test("uses a custom size", () => {
  const tag = host(render({ name: "react", size: 40 }));
  assert.match(tag, /width="40"/);
  assert.match(tag, /height="40"/);
});

test("applies color only to the mono variant", () => {
  const mono = render({ name: "react", variant: "mono", color: "#112233" });
  assert.match(mono, /#112233/);
  assert.doesNotMatch(mono, /currentColor/);

  const original = render({ name: "react", variant: "original", color: "#112233" });
  assert.match(original, /#61DAFB/);
  assert.doesNotMatch(original, /#112233/);
});
