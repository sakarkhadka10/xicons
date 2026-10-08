# @axcore/xicons-react

React 19+ component library for XIcons developer SVGs.

`@axcore/xicons-react` provides a simple `<Icon />` component for rendering XIcons with support for icon aliases, original and monochrome variants, sizing, colors, accessibility, and custom styling.

## Install

```bash
npm install @axcore/xicons-react
```

Also works with:

```bash
pnpm add @axcore/xicons-react
```

```bash
yarn add @axcore/xicons-react
```

```bash
bun add @axcore/xicons-react
```

### Requirements

- React `^19.3.0` (peer dependency)
- `@axcore/xicons` is a dependency and is installed with this package

---

## Basic Usage

```tsx
import { Icon } from "@axcore/xicons-react";

export function Example() {
  return <Icon name="react" size={32} title="React" />;
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
<Icon name="react" variant="original" size={32} />
```

### Monochrome

```tsx
<Icon name="react" variant="mono" size={32} />
```

The default variant is `original`.

If a requested `mono` variant is unavailable, the core registry falls back to the `original` variant.

---

## Props

| Prop        | Type                   | Default      | Description                                 |
| ----------- | ---------------------- | ------------ | ------------------------------------------- |
| `name`      | `string`               | required     | Icon name or registered alias               |
| `variant`   | `"original" \| "mono"` | `"original"` | Icon variant                                |
| `size`      | `number \| string`     | —            | Icon box size                               |
| `color`     | `string`               | —            | Wrapper color; useful with monochrome icons |
| `title`     | `string`               | —            | Accessible icon title                       |
| `className` | `string`               | —            | CSS/Tailwind classes                        |
| `style`     | `CSSProperties`        | —            | Inline styles                               |

---

## Sizing

Use the `size` prop when you want to control the icon dimensions directly:

```tsx
<Icon name="react" size={32} />
```

You can also provide a string value:

```tsx
<Icon name="react" size="2rem" />
```

---

## Tailwind CSS

The `className` prop works with Tailwind CSS:

```tsx
<Icon name="react" className="h-6 w-6 shrink-0" />
```

For monochrome icons:

```tsx
<Icon name="nextjs" variant="mono" className="h-8 w-8 text-zinc-700" />
```

### Size precedence

When using Tailwind dimensions, omit `size`:

```tsx
<Icon name="react" className="h-6 w-6" />
```

Do not combine:

```tsx
<Icon name="react" size={32} className="h-6 w-6" />
```

When both `size` and Tailwind width/height are set, the inline `size` styles win over the classes. A `style` prop is applied after `size`, so width or height in `style` overrides `size`.

---

## Colors

The `color` prop sets the CSS `color` of the wrapper. Mono icons use `currentColor`, so they follow that value. Original artwork keeps its own fills. `color` does not rewrite those fills.

```tsx
<Icon name="react" variant="mono" size={32} color="#61DAFB" />
```

You can also use Tailwind's text color utilities:

```tsx
<Icon name="react" variant="mono" className="h-8 w-8 text-blue-500" />
```

---

## Accessibility

Use the `title` prop when the icon conveys meaningful information:

```tsx
<Icon name="react" size={32} title="React" />
```

For decorative icons, omit the `title`:

```tsx
<Icon name="react" size={32} />
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

## Styling

You can use `className`:

```tsx
<Icon name="react" className="h-6 w-6 shrink-0" />
```

Or inline styles:

```tsx
<Icon
  name="react"
  style={{
    width: 32,
    height: 32,
  }}
/>
```

---

## Examples

### Basic Icon

```tsx
<Icon name="react" size={32} />
```

### Accessible Icon

```tsx
<Icon name="react" size={32} title="React" />
```

### Monochrome Icon

```tsx
<Icon name="nextjs" variant="mono" size={32} />
```

### Tailwind Icon

```tsx
<Icon name="react" className="h-6 w-6 shrink-0" />
```

### Tailwind Monochrome Icon

```tsx
<Icon name="nextjs" variant="mono" className="h-8 w-8 text-zinc-700" />
```

### Multiple Icons

```tsx
<div className="flex items-center gap-4">
  <Icon name="react" className="h-8 w-8" />

  <Icon name="nextjs" variant="mono" className="h-8 w-8 text-zinc-700" />
</div>
```

---

## TypeScript

The package is written for TypeScript and provides type definitions.

Example:

```tsx
import type { IconProps } from "@axcore/xicons-react";
```

Use the exported component props type when building your own wrappers:

```tsx
import { Icon } from "@axcore/xicons-react";
import type { IconProps } from "@axcore/xicons-react";

export function MyIcon(props: IconProps) {
  return <Icon {...props} />;
}
```

---

## How It Works

`@axcore/xicons-react` uses the shared XIcons core registry:

```text
@axcore/xicons
        │
        ▼
@axcore/xicons-react
        │
        ▼
     <Icon />
```

The React package handles React rendering while the core package provides the icon registry and SVG data.

---

## Related Packages

### Core

[`@axcore/xicons`](https://www.npmjs.com/package/@axcore/xicons)

Framework-agnostic XIcons registry, SVG utilities, aliases, and TypeScript types.

### React Native

[`@axcore/xicons-react-native`](https://www.npmjs.com/package/@axcore/xicons-react-native)

React Native / Expo icon component powered by `react-native-svg`.

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

The React package is part of the XIcons monorepo.

To contribute an icon, improve the React component, or report an issue:

**[Read the Contribution Guide](../../CONTRIBUTING.md)**

All contributions go through a Pull Request and automated CI validation.

---

## License

MIT.

Third-party logos and brand assets may be subject to their respective trademarks, copyrights, licenses, and brand guidelines.

XIcons does not grant trademark rights to any depicted brand.
