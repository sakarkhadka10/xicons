import assert from "node:assert/strict";
import { test } from "node:test";
import { icons } from "../src/icons.generated.js";
import { getIcon, getIconSvg } from "../src/registry.js";

test("getIconSvg falls back to original when mono markup is absent", () => {
  const icon = icons.react;
  assert.ok(icon?.variants.mono);
  const mono = icon.variants.mono;

  const mutableVariants = icon.variants as {
    original: string;
    mono?: string;
  };

  delete mutableVariants.mono;
  try {
    assert.equal(getIcon("react", "mono")?.name, "react");
    assert.equal(getIconSvg("react", "mono"), icon.variants.original);
    assert.equal(getIconSvg("  REACTJS  ", "mono"), icon.variants.original);
  } finally {
    mutableVariants.mono = mono;
  }

  assert.equal(getIconSvg("react", "mono"), mono);
});
