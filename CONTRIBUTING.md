# Contributing to XIcons

Thank you for helping grow the catalog. This document describes how icons are defined, validated, and shipped so every contribution fits the same pipeline.

User-facing docs live in [`docs/`](./docs/README.md). Package readmes under `packages/*/README.md` are written for npm.

## Before you open a PR

1. **Search** the repo and existing PRs — duplicate icons are rejected.
2. **Confirm rights** — you may only submit artwork you are allowed to redistribute. Official logos often require permission or must follow brand guidelines. When in doubt, open an issue first.
3. **Prefer accuracy** — `original` variants should match widely recognized brand colors; `mono` variants should be clean silhouettes using `currentColor` only (no hard-coded fills except transparent/none).

## How the pipeline works

```text
icons/{name}/          ← you edit these
        ↓
generate-icons.mjs     ← build step (packages/core)
        ↓
icons.generated.ts     ← generated on build (do not hand-edit)
        ↓
@axcore/xicons         ← getIcon / getIconSvg / listIcons
        ↓
React · React Native · CDN
```

Running `pnpm build` or `pnpm validate` always regenerates the registry from `icons/`.

## Adding a new icon

### 1. Create a directory

The folder name **must** equal `metadata.json` → `name` (lowercase, no spaces).

```text
icons/vite/
  metadata.json
  original.svg
  mono.svg          # strongly recommended
```

### 2. Write `metadata.json`

| Field | Required | Notes |
| --- | --- | --- |
| `name` | Yes | Stable ID; must match directory name |
| `title` | Yes | Human label (e.g. `"Next.js"`) |
| `category` | Yes | One of: `language`, `framework`, `library`, `runtime`, `database`, `cloud`, `devops`, `tool`, `editor`, `design`, `mobile`, `ai`, `platform`, `other` |
| `website` | No | Official project URL |
| `aliases` | No | Alternate lookup strings (lowercase recommended). Must not collide with another icon’s `name` or alias |

Example:

```json
{
  "name": "vite",
  "title": "Vite",
  "category": "tool",
  "website": "https://vite.dev",
  "aliases": ["vitejs"]
}
```

### 3. Author SVGs

Both files are root-level `<svg>` elements.

**Shared rules**

- Include `viewBox="0 0 24 24"` (24×24 coordinate system).
- No scripts, foreign objects, or external references (`href` to remote URLs).
- Keep paths minimal; avoid editor cruft (unused defs, random ids if possible).
- File must start with `<svg` after trim.

**`original.svg`**

- Use the brand’s recognizable colors.
- Required for every icon.

**`mono.svg`**

- Single-color artwork: use `fill="currentColor"` and/or `stroke="currentColor"`.
- Do not embed brand hex colors in `mono` (consumers supply color via CSS or the `color` prop).
- Optional at the file level, but expected for icons intended for dark/light UI themes.

Reference implementations: [`icons/react/`](./icons/react), [`icons/nextjs/`](./icons/nextjs).

### 4. Validate locally

From the repository root:

```bash
pnpm validate
```

This runs, in order:

1. `@axcore/xicons-icon-validator` — structure and SVG checks under `icons/`
2. Typecheck across the monorepo (depends on a fresh `@axcore/xicons` build)
3. Lint
4. Unit tests on the registry

Fix any error before pushing. Common failures:

| Error | Fix |
| --- | --- |
| `name must match directory` | Rename folder or fix `metadata.json` → `name` |
| `alias conflicts` | Choose a unique alias |
| `missing original.svg` | Add required variant |
| `missing viewBox` | Add `viewBox="0 0 24 24"` |

To regenerate the registry without a full monorepo build:

```bash
pnpm --filter @axcore/xicons generate
```

## Pull request guidelines

- **One icon per PR** when possible — easier review and licensing audit.
- Fill out [`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md).
- State the **license / trademark** basis for the artwork (link to brand guidelines, permission, or public media kit if applicable).
- Do not commit changes only under `packages/core/dist/` — dist is build output; source changes belong in `icons/` and hand-written package code.

## Changing existing icons

- Treat renames as breaking: update `name` only with strong justification and a migration note.
- Visual tweaks to `original` should stay faithful to the brand; note intentional corrections in the PR description.
- Regenerate and run `pnpm validate` after any SVG or metadata edit.

## Code contributions (non-icon)

- Follow existing TypeScript style (`strict`, ES modules, `.js` extensions in relative imports).
- Keep packages thin: registry logic stays in `@axcore/xicons`; UI wrappers stay in React / RN packages; HTTP rendering stays in `apps/cdn`.
- Add or update tests in `packages/core/test/` when changing lookup or SVG helper behavior.

## Questions

- **Icon request** — use the [icon request issue template](./.github/ISSUE_TEMPLATE/icon-request.yml).
- **Licensing uncertainty** — open an issue before spending time on artwork.

We appreciate focused, reviewable contributions.
