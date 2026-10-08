# @axcore/xicons-react

React 19+ component for XIcons developer SVGs.

## Install

```bash
npm install @axcore/xicons-react
```

Requires **react** ^19.3.0

## Example

```tsx
import { Icon } from "@axcore/xicons-react";

<Icon name="react" size={32} title="React" />;
<Icon name="nextjs" variant="mono" className="h-6 w-6 shrink-0 text-neutral-900" />;
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Icon name or alias |
| `variant` | `"original"` \| `"mono"` | `"original"` | Color style |
| `size` | `number` \| `string` | — | Box size; omit when using Tailwind `h-*` / `w-*` on `className` |
| `color` | `string` | — | Wrapper color (mono uses `currentColor`) |
| `title` | `string` | — | Accessible name |
| `className` | `string` | — | Wrapper classes |
| `style` | `CSSProperties` | — | Wrapper inline styles |

Unknown icons render nothing (`null`).

## Tailwind

```tsx
<Icon name="react" className="h-6 w-6 shrink-0" />
<Icon name="next" variant="mono" className="h-8 w-8 text-zinc-700" />
```

Do not pass `size` and Tailwind dimensions together — `size` wins.

## License

MIT
