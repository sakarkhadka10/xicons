import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { XIcon } from "../src/index.js";

const icons = (await import("../dist/icons.js" as string)) as Record<string, XIcon>;
const render = (name: string, props: Record<string, unknown> = {}) =>
  renderToStaticMarkup(createElement(icons[name]!, props));

test("exports 10k+ icon components", () => {
  assert.ok(Object.keys(icons).length > 10_000);
  assert.equal(icons.IconCamera!.displayName, "camera");
});

test("renders a decorative stroke icon with Tailwind-friendly defaults", () => {
  const html = render("IconCamera", {
    className: "size-5 text-sky-500",
    strokeWidth: 1.5,
  });

  assert.match(
    html,
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"/,
  );
  assert.match(
    html,
    /width="24" height="24" class="xi xi-camera size-5 text-sky-500" aria-hidden="true"/,
  );
  assert.match(html, /<path d="[^"]+"><\/path><\/svg>$/);
});

test("titled icons are accessible images; fill icons drop the stroke", () => {
  const html = render("IconCameraFilled", { size: 32, title: "Camera" });

  assert.match(html, /fill="currentColor" stroke="none"/);
  assert.match(html, /width="32" height="32"/);
  assert.match(html, /role="img"><title>Camera<\/title>/);
  assert.doesNotMatch(html, /aria-hidden/);
});
