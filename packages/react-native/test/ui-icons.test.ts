import assert from "node:assert/strict";
import { register } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { XIcon } from "../src/index.js";

register(new URL("./svg-mock-loader.ts", import.meta.url));

const { IconCamera } = (await import("../dist/icons.js" as string)) as {
  IconCamera: XIcon;
};

test("renders react-native-svg elements with size, color and defaults", () => {
  const html = renderToStaticMarkup(createElement(IconCamera, { size: 20, color: "red" }));

  assert.match(
    html,
    /^<rn-svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"/,
  );
  assert.match(html, /width="20" height="20" color="red"/);
  assert.match(html, /<rn-path d="[^"]+"><\/rn-path><\/rn-svg>$/);
});
