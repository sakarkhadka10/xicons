# XIcons

[![CI](https://github.com/sakarkhadka10/xicons/actions/workflows/ci.yml/badge.svg)](https://github.com/sakarkhadka10/xicons/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@axcore/xicons.svg)](https://www.npmjs.com/package/@axcore/xicons)
[![React](https://img.shields.io/npm/v/@axcore/xicons-react.svg)](https://www.npmjs.com/package/@axcore/xicons-react)
[![React Native](https://img.shields.io/npm/v/@axcore/xicons-react-native.svg)](https://www.npmjs.com/package/@axcore/xicons-react-native)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**Developer icons for React, React Native, and SVG URLs.**

One catalog. Two variants. Multiple runtimes.

XIcons provides a single, validated icon source for modern applications, with support for **React**, **React Native / Expo**, direct **SVG access**, and a developer-friendly registry API.

---

## Why XIcons?

Icon libraries often become fragmented across frameworks, duplicated across projects, and difficult to keep consistent.

XIcons keeps the source of truth in one place:

```text
                    XIcons
                       │
          ┌────────────┼────────────┐
          │            │            │
        React      React Native     SVG
          │            │            │
       <Icon />      <Icon />      URL/CDN
```

Each icon can provide:

- **Original** — full-color artwork
- **Mono** — `currentColor` version for theming
- **Aliases** — convenient alternative names
- **Metadata** — title, category, website, and aliases
- **Generated registry** — consistent access across packages
- **Validation** — automated SVG and registry checks

---

## Install

Choose the package for your runtime.

| Package             | Install                                                    |
| ------------------- | ---------------------------------------------------------- |
| React               | `npm install @axcore/xicons-react`                         |
| React Native / Expo | `npm install @axcore/xicons-react-native react-native-svg` |
| Core / Registry     | `npm install @axcore/xicons`                               |

XIcons works with:

- npm
- pnpm
- Yarn
- Bun

The package names remain the same regardless of your package manager.

---

## React

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

The `mono` variant uses `currentColor`, making it easy to integrate with CSS, Tailwind, dark mode, and application themes.

---

## React Native / Expo

```tsx
import { Icon } from "@axcore/xicons-react-native";

export function TechStack() {
  return <Icon name="react" size={24} color="#61DAFB" />;
}
```

Requires:

```bash
npm install @axcore/xicons-react-native react-native-svg
```

See the [React Native documentation](./docs/react-native.md) for Expo setup and usage.

---

## SVG / CDN

`@axcore/xicons-cdn` is a private app in `apps/cdn`. It composes catalog icons into one SVG. This repository does not deploy a public host, and `xicons.dev` is not a running service.

Run the server locally:

```bash
pnpm --filter @axcore/xicons-cdn dev
```

```text
http://localhost:8787/icons?i=react,nextjs&size=32&gap=8
```

Self-host that app when you want an SVG URL for a README, docs site, or portfolio. See the [CDN documentation](./docs/cdn.md) for query parameters.

---

## Icon Variants

Each icon can provide two visual variants.

### Original

The original variant preserves the icon's intended colors.

```tsx
<Icon name="react" />
```

Use it when you want the recognizable brand appearance.

### Mono

The mono variant uses `currentColor`.

```tsx
<Icon name="react" variant="mono" className="text-blue-500" />
```

This makes icons work naturally with:

- Light and dark themes
- Tailwind CSS
- CSS variables
- Hover states
- Design systems
- Custom application colors

---

## Packages

| Package                                                                                    | Description                              |
| ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| [`@axcore/xicons`](https://www.npmjs.com/package/@axcore/xicons)                           | Core registry, types, and SVG utilities  |
| [`@axcore/xicons-react`](https://www.npmjs.com/package/@axcore/xicons-react)               | React `<Icon />` component               |
| [`@axcore/xicons-react-native`](https://www.npmjs.com/package/@axcore/xicons-react-native) | React Native / Expo `<Icon />` component |

### Core

```ts
import { getIcon, getIconSvg, hasIcon, listIcons } from "@axcore/xicons";
```

The core package provides the underlying icon registry and utilities used by the framework packages.

---

## Icon Registry

Icons are defined from the `icons/` directory.

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

The registry is generated from these source files.

Generated files should not be edited manually.

---

## Aliases

Icons can define aliases for commonly used alternative names.

For example:

```ts
getIcon("next");
getIcon("next.js");
getIcon("nextjs");
```

can resolve to the canonical `nextjs` icon when those aliases are defined.

See the [Icon Catalog](./docs/icons.md) for available icons, names, aliases, and variants.

---

## Documentation

| Guide                                        | Contents                                               |
| -------------------------------------------- | ------------------------------------------------------ |
| [Getting Started](./docs/getting-started.md) | Installation, local development, and basic usage       |
| [React](./docs/react.md)                     | React component API, props, styling, and accessibility |
| [React Native](./docs/react-native.md)       | React Native / Expo usage and colors                   |
| [Core API](./docs/core-api.md)               | Registry functions, types, and SVG utilities           |
| [CDN / SVG URLs](./docs/cdn.md)              | URL parameters and SVG embedding                       |
| [Icon Catalog](./docs/icons.md)              | Icon names, aliases, variants, and metadata            |
| [Release Guide](./docs/release.md)           | Maintainer release and publishing workflow             |

---

## Development

### Requirements

- Node.js 22+
- pnpm 12.10.1+

Check your environment:

```bash
node --version
pnpm --version
```

### Install

```bash
pnpm install
```

### Validate

Run the complete validation suite:

```bash
pnpm validate
```

This includes:

- Icon validation
- Type checking
- Linting
- Tests

### Build

```bash
pnpm build
```

### Package verification

```bash
pnpm pack:verify
```

### Local CDN development

```bash
pnpm --filter @axcore/xicons-cdn dev
```

The local server runs at:

```text
http://localhost:8787
```

---

## Contributing

XIcons is open source and contributions are welcome.

The easiest way to contribute an icon is:

```text
Fork
  ↓
Create a branch
  ↓
Add your icon
  ↓
pnpm validate
  ↓
Open a Pull Request
  ↓
CI
  ↓
Maintainer review
  ↓
Merge
```

The `main` branch is protected.

All changes must go through a Pull Request and pass the required CI checks before merging.

### Add an icon

An icon normally contains:

```text
icons/<icon-slug>/
├── original.svg
├── mono.svg
└── metadata.json
```

Before contributing, please read:

**[Contributing to XIcons →](./CONTRIBUTING.md)**

It covers:

- Icon structure
- SVG requirements
- Metadata
- Naming
- Aliases
- Licensing
- Validation
- Pull Requests
- Review process

---

## Quality and Validation

XIcons uses automated validation to keep the icon catalog consistent.

Pull Requests are tested against the supported Node.js versions.

Required CI checks include:

```text
validate (22)
validate (24)
```

The CI pipeline verifies:

- SVG validity
- Icon metadata
- Generated registry consistency
- TypeScript
- Linting
- Tests
- Builds
- Package contents

Contributors do not need npm publishing access.

---

## Releases

XIcons packages are released together.

The current publishable packages are:

```text
@axcore/xicons
@axcore/xicons-react
@axcore/xicons-react-native
```

Releases are managed by the maintainer and published automatically through GitHub Actions and npm Trusted Publishing.

Contributors should **not** run `npm publish` for the project.

See the [Release Guide](./docs/release.md) for the maintainer workflow.

---

## Project Structure

```text
xicons/
├── apps/
│   └── cdn/                  @axcore/xicons-cdn (private)
├── icons/
│   ├── react/
│   └── nextjs/
├── packages/
│   ├── core/                 @axcore/xicons
│   ├── react/                @axcore/xicons-react
│   └── react-native/         @axcore/xicons-react-native
├── tools/
│   └── icon-validator/       @axcore/xicons-icon-validator (private)
├── scripts/
├── docs/
├── .github/
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── package.json
└── pnpm-workspace.yaml
```

The `icons/` directory is the source of truth for icon assets.

---

## License

The XIcons codebase is licensed under the [MIT License](./LICENSE).

Documentation is maintained as part of the project.

Icon artwork may be subject to third-party trademarks, copyrights, licenses, and brand guidelines.

XIcons does not grant trademark rights to any depicted brand.

Contributors should review the [contribution and licensing guidelines](./CONTRIBUTING.md) before submitting third-party brand assets.

---

## Status

XIcons is actively under development.

The catalog currently ships `react` and `nextjs`. New icons are added only when the source file and its redistribution terms are linked in the pull request. See [Contributing](./CONTRIBUTING.md).

If you find a bug, want to request an icon, or have an idea for improving XIcons, please open an issue or Pull Request.

---

## Contributing ❤️

If XIcons is useful to you, consider contributing an icon, improving the documentation, reporting a bug, or sharing the project with other developers.

Every contribution helps make the ecosystem better.

**Built with ❤️ for developers.**
