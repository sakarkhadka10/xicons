# Icon catalog

Icons are added under `icons/{name}/` in the repository and compiled into `@axcore/xicons` at build time. This page lists **bundled names** in the current release line.

## Available icons

| Name | Title | Aliases | Variants |
| --- | --- | --- | --- |
| `react` | React | `reactjs` | original, mono |
| `nextjs` | Next.js | `next`, `next.js` | original, mono |

Lookup is case-insensitive. Update this table in the same pull request that adds an icon. It is maintained by hand.

Print the generated catalog from the repository root after `pnpm build`:

```bash
node --input-type=module -e "import { listIcons } from './packages/core/dist/index.js'; console.table(listIcons().map((icon) => ({ name: icon.name, title: icon.title, aliases: (icon.aliases ?? []).join(', ') })))"
```

## Usage examples

```tsx
<Icon name="react" />
<Icon name="reactjs" />
<Icon name="next" variant="original" />
```

```text
/icons?i=react,nextjs
/icons?i=reactjs,next
```

## Variants

| File | Role |
| --- | --- |
| `original.svg` | Full-color artwork on a transparent canvas (required) |
| `mono.svg` | Single color via `currentColor` (optional; **default** for npm/React; falls back to `original`) |
| `branded.svg` | Badge-style full-color artwork (optional; **default** for CDN; falls back to `original`) |

## Adding icons

See [Contributing](../CONTRIBUTING.md). Add files under `icons/{name}/`, run `pnpm validate`, and commit the regenerated `packages/core/src/icons.generated.ts` in the same pull request. Do not edit that file by hand.
