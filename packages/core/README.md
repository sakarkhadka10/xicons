````md
# @axcore/xicons

Framework-agnostic icon registry for **XIcons**.

The core package provides the shared icon definitions, registry, SVG utilities, aliases, and TypeScript types used across the XIcons ecosystem.

It works with Node.js, browser applications, bundlers, and other JavaScript/TypeScript environments.

---

## Install

```bash
npm install @axcore/xicons
```
````

Also works with:

```bash
pnpm add @axcore/xicons
```

```bash
yarn add @axcore/xicons
```

```bash
bun add @axcore/xicons
```

---

## Basic Usage

```ts
import { getIcon, getIconSvg, hasIcon, listIcons } from "@axcore/xicons";

// List all registered icons
const icons = listIcons();

// Get an icon definition
const react = getIcon("react");

// Get an SVG string
const svg = getIconSvg("react");

// Get the monochrome variant
const monoSvg = getIconSvg("react", "mono");

// Check whether an icon exists
const exists = hasIcon("react");
```

---

## Icon Variants

XIcons supports two icon variants:

| Variant    | Description                         |
| ---------- | ----------------------------------- |
| `original` | Original/full-color icon artwork    |
| `mono`     | Monochrome SVG using `currentColor` |

Example:

```ts
const original = getIconSvg("react", "original");

const mono = getIconSvg("react", "mono");
```

If a requested `mono` variant is unavailable, the registry falls back to the `original` variant.

---

## Icon Names and Aliases

Icons have a canonical name and may also provide aliases.

Always use the canonical icon name when possible.

```ts
const icon = getIcon("react");
```

If an alias is defined for an icon, it can also be resolved through the registry:

```ts
const icon = getIcon("reactjs");
```

You can check whether a name or alias exists:

```ts
hasIcon("react");
```

```ts
hasIcon("reactjs");
```

> Alias availability depends on the icon's `metadata.json`. Only documented or registered aliases are supported.

---

## API

### `listIcons()`

Returns all registered icon definitions.

```ts
const icons = listIcons();
```

Example:

```ts
const names = listIcons().map((icon) => icon.name);
```

---

### `getIcon(name, variant?)`

Returns an icon definition or `undefined`.

```ts
const icon = getIcon("react");
```

Specify a variant:

```ts
const icon = getIcon("react", "mono");
```

Returns:

```ts
IconDefinition | undefined;
```

---

### `getIconSvg(name, variant?)`

Returns the SVG markup for an icon.

```ts
const svg = getIconSvg("react");
```

Monochrome:

```ts
const svg = getIconSvg("react", "mono");
```

Returns:

```ts
string | undefined;
```

The returned SVG can be used wherever raw SVG markup is appropriate.

---

### `hasIcon(name)`

Checks whether an icon name or registered alias exists.

```ts
if (hasIcon("react")) {
  // Icon exists
}
```

Returns:

```ts
boolean;
```

---

## SVG Utilities

The core package also exports helpers for working with SVG markup.

### `parseViewBox`

Parses an SVG `viewBox`.

```ts
import { parseViewBox } from "@axcore/xicons";

const viewBox = parseViewBox("0 0 24 24");
```

---

### `stripSvgWrapper`

Removes the outer `<svg>` wrapper while preserving the inner SVG markup.

```ts
import { stripSvgWrapper } from "@axcore/xicons";

const inner = stripSvgWrapper(svg);
```

---

### `escapeXml`

Escapes XML-sensitive characters.

```ts
import { escapeXml } from "@axcore/xicons";

const safe = escapeXml(value);
```

---

## TypeScript

The package includes TypeScript definitions.

Core types include:

```ts
IconDefinition;
IconVariant;
IconName;
IconCategory;
```

Example:

```ts
import type { IconDefinition, IconVariant } from "@axcore/xicons";
```

The icon name types are generated from the registered icon catalog.

---

## When Should I Use Core?

Use `@axcore/xicons` when you need direct access to the XIcons registry, icon definitions, or SVG data.

For UI components, use the framework-specific packages instead:

| Environment                 | Package                       |
| --------------------------- | ----------------------------- |
| React                       | `@axcore/xicons-react`        |
| React Native / Expo         | `@axcore/xicons-react-native` |
| Node / custom UI / registry | `@axcore/xicons`              |

For React applications, you will generally want:

```bash
npm install @axcore/xicons-react
```

rather than interacting with the core registry directly.

---

## Source of Truth

The XIcons icon catalog is maintained in the main repository:

```text
icons/
├── react/
│   ├── original.svg
│   ├── mono.svg
│   └── metadata.json
│
└── nextjs/
    ├── original.svg
    ├── mono.svg
    └── metadata.json
```

The core registry is generated from these source assets.

Generated files should not be manually edited.

---

## Related Packages

### React

[`@axcore/xicons-react`](https://www.npmjs.com/package/@axcore/xicons-react)

React `<Icon />` component powered by the XIcons core registry.

### React Native

[`@axcore/xicons-react-native`](https://www.npmjs.com/package/@axcore/xicons-react-native)

React Native / Expo `<Icon />` component powered by `react-native-svg`.

---

## Documentation

For the complete XIcons documentation:

**[XIcons Documentation](../../docs/README.md)**

Useful guides:

- [Getting Started](../../docs/getting-started.md)
- [React](../../docs/react.md)
- [React Native](../../docs/react-native.md)
- [Core API](../../docs/core-api.md)
- [CDN / SVG URLs](../../docs/cdn.md)
- [Icon Catalog](../../docs/icons.md)

---

## Contributing

The icon source files live in the main XIcons repository.

To contribute an icon or improve the project:

**[Read the Contribution Guide](../../CONTRIBUTING.md)**

All contributions go through a Pull Request and automated CI validation.

---

## License

MIT.

Third-party logos and brand assets may be subject to their respective trademarks, copyrights, licenses, and brand guidelines.

XIcons does not grant trademark rights to any depicted brand.

```

```
