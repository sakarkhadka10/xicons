# @axcore/xicons-react-native

React Native / Expo icon component for XIcons.

`@axcore/xicons-react-native` provides a simple `<Icon />` component for rendering XIcons in React Native and Expo applications, with support for icon aliases, original and monochrome variants, sizing, colors, and theming.

## Install

```bash
npm install @axcore/xicons-react-native react-native-svg
```

Also works with:

```bash
pnpm add @axcore/xicons-react-native react-native-svg
```

```bash
yarn add @axcore/xicons-react-native react-native-svg
```

```bash
bun add @axcore/xicons-react-native react-native-svg
```

### Requirements

- React `^19.3.0` (peer dependency)
- React Native `>= 0.78` (peer dependency)
- `react-native-svg` `>= 15` (dependency of this package)

Install `react-native-svg` in the app as well so native autolinking sees it. Expo apps are supported.

---

## Basic Usage

```tsx
import { Icon } from "@axcore/xicons-react-native";

export function Example() {
  return <Icon name="react" size={28} />;
}
```

---

## Icon Variants

XIcons supports two icon variants:

| Variant    | Description                         |
| ---------- | ----------------------------------- |
| `original` | Original/full-color icon artwork    |
| `mono`     | Monochrome SVG using `currentColor` |

### Original

```tsx
<Icon name="react" variant="original" size={28} />
```

### Monochrome

```tsx
<Icon name="react" variant="mono" size={28} />
```

The default variant is `original`.

If a requested `mono` variant is unavailable, the core registry falls back to the `original` variant.

---

## Props

| Prop      | Type                   | Default      | Description                       |
| --------- | ---------------------- | ------------ | --------------------------------- |
| `name`    | `string`               | required     | Icon name or registered alias     |
| `variant` | `"original" \| "mono"` | `"original"` | Icon variant                      |
| `size`    | `number`               | `24`         | Icon width and height             |
| `color`   | `string`               | —            | Color applied to monochrome icons |

---

## Sizing

The `size` prop controls both the width and height of the icon.

```tsx
<Icon name="react" size={32} />
```

Example with different sizes:

```tsx
<View>
  <Icon name="react" size={20} />
  <Icon name="react" size={28} />
  <Icon name="react" size={40} />
</View>
```

---

## Colors

`color` is a string. For `mono`, every `currentColor` in the SVG is replaced with that string. For `original`, `color` is ignored and the brand fills stay in the file.

```tsx
<Icon name="react" variant="mono" size={28} color="#61DAFB" />
```

```tsx
<Icon name="react" variant="mono" size={28} color="blue" />
```

---

## Aliases

The `name` prop accepts canonical icon names and registered aliases.

```tsx
<Icon name="react" />
```

If an alias is registered for an icon, it can also be used:

```tsx
<Icon name="reactjs" />
```

> Alias availability depends on the icon's `metadata.json`. Only registered aliases are supported.

---

## Unknown Icons

If the requested icon does not exist, the component renders nothing (`null`).

```tsx
<Icon name="does-not-exist" />
```

This allows applications to safely render icons without requiring an exception for an unknown name.

---

## Expo

XIcons works with Expo applications.

Install the package and `react-native-svg`:

```bash
npx expo install @axcore/xicons-react-native react-native-svg
```

Then use the component normally:

```tsx
import { Icon } from "@axcore/xicons-react-native";

export default function App() {
  return <Icon name="react" size={32} />;
}
```

---

## Examples

### Basic Icon

```tsx
<Icon name="react" size={28} />
```

### Monochrome Icon

```tsx
<Icon name="react" variant="mono" size={28} />
```

### Colored Monochrome Icon

```tsx
<Icon name="react" variant="mono" size={28} color="#61DAFB" />
```

### Multiple Icons

```tsx
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  }}
>
  <Icon name="react" size={32} />

  <Icon name="nextjs" variant="mono" size={32} color="#111111" />
</View>
```

---

## TypeScript

The package includes TypeScript definitions.

Example:

```tsx
import type { IconProps } from "@axcore/xicons-react-native";
```

You can use the exported props type when creating your own wrappers:

```tsx
import { Icon } from "@axcore/xicons-react-native";
import type { IconProps } from "@axcore/xicons-react-native";

export function MyIcon(props: IconProps) {
  return <Icon {...props} />;
}
```

---

## How It Works

`@axcore/xicons-react-native` uses the shared XIcons core registry and `react-native-svg` for rendering:

```text
@axcore/xicons
        │
        ▼
@axcore/xicons-react-native
        │
        ▼
react-native-svg
        │
        ▼
   React Native
```

The React Native package handles native SVG rendering while the core package provides the icon registry and SVG data.

---

## Related Packages

### Core

[`@axcore/xicons`](https://www.npmjs.com/package/@axcore/xicons)

Framework-agnostic XIcons registry, SVG utilities, aliases, and TypeScript types.

### React

[`@axcore/xicons-react`](https://www.npmjs.com/package/@axcore/xicons-react)

React component for rendering XIcons in web applications.

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

The React Native package is part of the XIcons monorepo.

To contribute an icon, improve the React Native component, or report an issue:

**[Read the Contribution Guide](../../CONTRIBUTING.md)**

All contributions go through a Pull Request and automated CI validation.

---

## License

MIT.

Third-party logos and brand assets may be subject to their respective trademarks, copyrights, licenses, and brand guidelines.

XIcons does not grant trademark rights to any depicted brand.
