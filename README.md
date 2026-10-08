# XIcons

**Developer icons for React, React Native, and SVG URLs.**

One catalog, two variants (`original` brand colors and `mono` for theming), zero duplicate assets. Built for npm, tree-shaken at the app boundary, and validated in CI.

---

## Install

Pick the package that matches your runtime:

| Package | Install |
| --- | --- |
| React | `npm install @axcore/xicons-react` |
| React Native / Expo | `npm install @axcore/xicons-react-native react-native-svg` |
| Registry / Node / custom UI | `npm install @axcore/xicons` |

Works with **pnpm**, **yarn**, and **bun** using the same package names.

---

## Example

```tsx
import { Icon } from "@axcore/xicons-react";

export function TechStack() {
  return (
    <div className="flex items-center gap-3">
      <Icon name="react" className="h-6 w-6 shrink-0" title="React" />
      <Icon name="nextjs" variant="mono" className="h-6 w-6 text-neutral-900" />
    </div>
  );
}
```

```md
<!-- README badge strip (CDN) -->
![Stack](https://xicons.dev/icons?i=react,nextjs&size=32&gap=8)
```

---

## Packages

| npm package | Description |
| --- | --- |
| [`@axcore/xicons-react`](./packages/react) | `<Icon />` component for React 19+ |
| [`@axcore/xicons-react-native`](./packages/react-native) | `<Icon />` for React Native / Expo |
| [`@axcore/xicons`](./packages/core) | Types, registry, `getIcon`, `getIconSvg` |

---

## Documentation

| Guide | Contents |
| --- | --- |
| [Getting started](./docs/getting-started.md) | Install paths, local `file:` testing, CDN dev server |
| [React](./docs/react.md) | Props, Tailwind, accessibility |
| [React Native](./docs/react-native.md) | Expo, `react-native-svg`, colors |
| [Core API](./docs/core-api.md) | Registry functions and types |
| [CDN / URL](./docs/cdn.md) | Query parameters and embedding |
| [Icon catalog](./docs/icons.md) | Names, aliases, variants |

Contributing icons: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Features

- **Original + mono** — brand SVGs and `currentColor` mono for light/dark UI
- **Aliases** — e.g. `next` and `next.js` resolve to `nextjs`
- **Typed** — TypeScript definitions on every package
- **Generated registry** — SVGs under `icons/` compile into `@axcore/xicons` at build time
- **CDN-friendly** — compose multiple icons into one SVG for docs and READMEs

---

## Development (this repo)

Requirements: **Node.js 22+**, **pnpm 12+**.

```bash
pnpm install
pnpm build
pnpm validate
pnpm --filter @axcore/xicons-cdn dev   # http://localhost:8787
```

---

## License

Code: [MIT](./LICENSE) · Docs: [docs/README.md](./docs/README.md)

Icon artwork may be subject to third-party trademarks; see [CONTRIBUTING.md](./CONTRIBUTING.md). XIcons does not grant trademark rights to depicted brands.
