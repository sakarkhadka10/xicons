# Icon catalog

Icons are added under `icons/{name}/` in the repository and compiled into `@axcore/xicons` at build time. This page lists **bundled names** in the current release line.

## Available icons

| Name | Title | Aliases | Variants |
| --- | --- | --- | --- |
| `react` | React | `reactjs` | original, mono |
| `nextjs` | Next.js | `next`, `next.js` | original, mono |

Lookup is always case-insensitive.

## Usage examples

```tsx
<Icon name="react" />
<Icon name="reactjs" />
<Icon name="next" variant="mono" />
```

```text
/icons?i=react,nextjs
/icons?i=reactjs,next
```

## Variants

| File | Role |
| --- | --- |
| `original.svg` | Brand colors (required) |
| `mono.svg` | Single color via `currentColor` (recommended) |

## Adding icons

See [Contributing](../CONTRIBUTING.md). After merge, run `pnpm build` in the monorepo to regenerate the registry.

When the catalog grows, this table will be generated automatically; until then, run:

```bash
pnpm --filter @axcore/xicons build
node -e "import { listIcons } from '@axcore/xicons'; console.table(listIcons().map(i=>({name:i.name,aliases:(i.aliases??[]).join(', ')})))"
```

(from repo root with workspace resolution)
