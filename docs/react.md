# React

Package: **`@axcore/xicons-react`**

Peer dependency: **`react` ^19.3.0**

## Install

```bash
npm install @axcore/xicons-react
```

## Basic usage

```tsx
import { Icon } from "@axcore/xicons-react";

<Icon name="react" size={32} title="React" />;
<Icon name="nextjs" variant="original" size={32} />;
<Icon name="next" variant="mono" size={32} color="#171717" />;
```

Names are case-insensitive. Aliases work (`next` → `nextjs`). See [Icon catalog](./icons.md).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Icon id or alias (required) |
| `variant` | `"original"` \| `"mono"` | `"original"` | Color style |
| `size` | `number` \| `string` | — | Width and height of the wrapper (px or CSS length) |
| `color` | `string` | — | CSS `color` on the wrapper. Mono icons pick it up through `currentColor`. Explicit fills in `original` artwork stay as drawn. |
| `title` | `string` | — | Accessible name; sets `role="img"` and `aria-label`. Omit it for decorative icons (`aria-hidden="true"`). |
| `className` | `string` | — | Applied to the outer wrapper |
| `style` | `CSSProperties` | — | Inline styles on the wrapper |

Unknown icons return `null` (no throw).

## Sizing with Tailwind

Omit `size` and dimension the wrapper with utility classes. The inner SVG fills the box (`width/height: 100%`).

```tsx
<Icon name="react" className="h-6 w-6 shrink-0" title="React" />
<Icon name="nextjs" variant="mono" className="h-8 w-8 text-slate-700 dark:text-slate-200" />
```

Do not combine `size={…}` with Tailwind width/height on the same icon. `size` writes inline width and height, which beat utility classes. A `style` prop is applied after `size`, so width or height in `style` overrides `size`.

Common utilities:

- `h-* w-*` — box size  
- `shrink-0` — prevent flex shrink  
- `text-*` — color for `variant="mono"`

## Variants

| Variant | When to use |
| --- | --- |
| `original` | Brand colors embedded in the SVG |
| `mono` | Single-color; uses `currentColor` (set `color` or `text-*`) |

If `mono` is missing for an icon, the original artwork is used.

## Accessibility

- Decorative icons: omit `title` (icon is `aria-hidden`).
- Meaningful icons: pass `title="React"` (or wrap in visible text).

## TypeScript

```tsx
import { Icon, type IconProps } from "@axcore/xicons-react";
import type { IconVariant } from "@axcore/xicons";
```

`@axcore/xicons-react` exports `Icon` and `IconProps`. `IconVariant` comes from `@axcore/xicons`.

## Tree-shaking

Import the package entry:

```tsx
import { Icon } from "@axcore/xicons-react";
```

`getIconSvg` loads the whole generated registry. A bundler does not drop unused icon names from that module.
