import assert from "node:assert/strict";
import { test } from "node:test";
import { iconCategories } from "../dist/index.js";
import {
  assertAliasAvailable,
  assertCanonicalNameAvailable,
  assertIconMetadata,
  assertSvg,
} from "../scripts/validate-icon.js";

const categories = [...iconCategories];

test("accepts metadata that matches an icon directory", () => {
  const meta = assertIconMetadata(
    "react",
    {
      name: "react",
      title: "React",
      category: "framework",
      website: "https://react.dev",
      aliases: ["reactjs"],
    },
    categories,
  );
  assert.equal(meta.name, "react");
  assert.deepEqual(meta.aliases, ["reactjs"]);
});

test("rejects a display name, unknown category, and self-alias", () => {
  assert.throws(
    () =>
      assertIconMetadata(
        "github",
        {
          name: "GitHub",
          slug: "github",
          category: "developer",
          aliases: ["github"],
        },
        categories,
      ),
    /name must be "github"/,
  );

  assert.throws(
    () =>
      assertIconMetadata(
        "github",
        { name: "github", title: "GitHub", category: "developer" },
        categories,
      ),
    /category must be one of/,
  );

  const names = new Set<string>();
  const aliases = new Set<string>();
  assert.throws(
    () => assertAliasAvailable("github", "github", names, aliases),
    /duplicates the canonical name/,
  );
});

test("rejects alias collisions with a canonical name", () => {
  const names = new Set<string>();
  const aliases = new Set<string>();
  assertCanonicalNameAvailable("alpha", names, aliases);
  assertAliasAvailable("alpha", "zeta", names, aliases);
  assert.throws(
    () => assertCanonicalNameAvailable("zeta", names, aliases),
    /conflicts with an existing alias/,
  );
});

test("svg checks require viewBox, reject scripts, and require currentColor for mono", () => {
  assert.throws(() => assertSvg("demo/original.svg", "<svg></svg>"), /viewBox/);
  assert.throws(
    () => assertSvg("demo/original.svg", '<svg viewBox="0 0 24 24"><script></script></svg>'),
    /scripts are not allowed/,
  );
  assert.throws(
    () =>
      assertSvg("demo/mono.svg", '<svg viewBox="0 0 24 24"></svg>', {
        requireCurrentColor: true,
      }),
    /currentColor/,
  );
  assert.doesNotThrow(() =>
    assertSvg(
      "demo/mono.svg",
      '<svg viewBox="0 0 24 24"><path fill="currentColor"/></svg>',
      { requireCurrentColor: true },
    ),
  );
});
