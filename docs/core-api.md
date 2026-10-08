# Core API

Package: **`@axcore/xicons`**

Use this package when you build your own components, SSR pipelines, email templates, or non-React renderers.

## Install

```bash
npm install @axcore/xicons
```

ESM only (`"type": "module"`). Node 22+ recommended.

## Exports

```ts
import {
  getIcon,
  getIconSvg,
  hasIcon,
  iconCategories,
  listIcons,
  parseViewBox,
  stripSvgWrapper,
  escapeXml,
  type IconDefinition,
  type IconMetadata,
  DEFAULT_CDN_VARIANT,
  DEFAULT_ICON_VARIANT,
  resolveIconSvg,
  type IconVariant,
  type IconCategory,
  type IconName,
} from "@axcore/xicons";
```

## Functions

### `getIcon(name, variant?)`

Returns the icon definition, including every variant SVG, or `undefined` when the name is unknown. `variant` does not remove the other SVG from the object. Use `getIconSvg` when you want one string.

Passing `mono` or `branded` for an icon that lacks that file still returns the definition. `getIconSvg` then falls back via `resolveIconSvg` (mono → original, branded → original).

Default variant for `getIconSvg(name)` is **`mono`** (`DEFAULT_ICON_VARIANT`). The CDN app defaults to **`branded`** (`DEFAULT_CDN_VARIANT`).

```ts
const icon = getIcon("nextjs", "mono");
icon?.title; // "Next.js"
icon?.variants.original; // "<svg …>"
icon?.variants.mono; // "<svg …>"
```

### `getIconSvg(name, variant?)`

Returns a single SVG string for rendering.

```ts
const svg = getIconSvg("react", "mono");
```

Resolution order for markup: use `resolveIconSvg(icon, variant)` — `mono` and `branded` fall back to `original` when optional files are absent.

### `hasIcon(name)`

```ts
hasIcon("reactjs"); // true (alias)
hasIcon("unknown"); // false
```

### `listIcons()`

```ts
const all = listIcons();
all.map((i) => i.name); // ["nextjs", "react", …]
```

Names are trimmed and lowercased at lookup time. `IconName` is a `string`, not a generated union of catalog ids. Canonical names come from each icon's `name` field.

## SVG helpers

Used by the CDN renderer; safe to reuse in custom tooling.

| Function | Purpose |
| --- | --- |
| `parseViewBox(svg, fallback?)` | Read `viewBox` attribute |
| `stripSvgWrapper(svg)` | Inner HTML without root `<svg>` |
| `escapeXml(str)` | Escape text for XML attributes |

## Types

### `IconVariant`

`"original" | "mono" | "branded"`

### `IconDefinition`

```ts
interface IconDefinition {
  name: string;
  title: string;
  category: IconCategory;
  website?: string;
  aliases?: readonly string[];
  variants: {
    original: string;
    mono?: string;
    branded?: string;
  };
}
```

### `IconCategory`

`language` · `framework` · `library` · `runtime` · `database` · `cloud` · `devops` · `tool` · `editor` · `design` · `mobile` · `ai` · `platform` · `other`

The same list is exported as `iconCategories`.

## Lookup rules

1. Trim and lowercase the requested name.  
2. Match canonical `name` in the registry.  
3. Else match any entry’s `aliases`.  
4. Unknown → `undefined` / `false` / `null` behavior in UI packages.
