# Getting started

## Requirements

| Runtime | Packages |
| --- | --- |
| React ^19.3.0 | `@axcore/xicons-react` |
| React Native ≥ 0.78 / Expo | `@axcore/xicons-react-native`, `react-native-svg` |
| Node / bundlers | `@axcore/xicons` |

## Install from npm

```bash
# React
npm install @axcore/xicons-react

# React Native
npm install @axcore/xicons-react-native react-native-svg

# Core only
npm install @axcore/xicons
```

## Use in your project

### React

```tsx
import { Icon } from "@axcore/xicons-react";

<Icon name="react" size={32} title="React" />;
```

See [React](./react.md) for Tailwind (`className="h-6 w-6"`) and props.

### React Native

```tsx
import { Icon } from "@axcore/xicons-react-native";

<Icon name="react" size={28} />;
```

See [React Native](./react-native.md).

### Core (custom renderers)

```ts
import { getIconSvg } from "@axcore/xicons";

const markup = getIconSvg("react", "mono");
```

See [Core API](./core-api.md).

## Test against a local checkout

If you are developing XIcons or testing before publish:

```bash
cd /path/to/xicons
pnpm install
pnpm build
```

In your app:

```bash
pnpm add @axcore/xicons@file:/path/to/xicons/packages/core \
         @axcore/xicons-react@file:/path/to/xicons/packages/react
```

Rebuild the monorepo after icon or API changes, then restart your app dev server.

## CDN (local)

```bash
cd /path/to/xicons
pnpm --filter @axcore/xicons-cdn dev
```

Open [http://localhost:8787/icons?i=react,nextjs](http://localhost:8787/icons?i=react,nextjs).

Details: [CDN & URL embedding](./cdn.md).

## Icon names

Look up names and aliases in the [icon catalog](./icons.md). Unknown names render nothing (React/RN) or are omitted from CDN strips.
