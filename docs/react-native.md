# React Native / Expo

Package: **`@axcore/xicons-react-native`**

## Install

```bash
npm install @axcore/xicons-react-native react-native-svg
```

Peer dependencies:

- `react` ^19.3.0  
- `react-native` ≥ 0.78  

Expo projects already include compatible React Native; install `react-native-svg` per [Expo docs](https://docs.expo.dev/versions/latest/sdk/svg/) if it is not present.

## Usage

```tsx
import { Icon } from "@axcore/xicons-react-native";
import { View } from "react-native";

export function Stack() {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <Icon name="react" size={32} />
      <Icon name="react" variant="mono" size={32} color="#61DAFB" />
      <Icon name="nextjs" size={32} />
    </View>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Icon id or alias (required) |
| `variant` | `"original"` \| `"mono"` | `"original"` | Color style |
| `size` | `number` | `24` | Width and height in density-independent pixels |
| `color` | `string` | — | For `variant="mono"`, replaces `currentColor` in the SVG |

Unknown icons return `null`.

## Colors

- **`original`** — brand colors are baked into the SVG; `color` is ignored.  
- **`mono`** — pass `color` to tint (implementation replaces `currentColor` in the markup).

## NativeWind / className

This component does not accept `className`. Wrap in a sized container:

```tsx
<View className="h-6 w-6">
  <Icon name="react" size={24} />
</View>
```

## TypeScript

```tsx
import { Icon, type IconProps } from "@axcore/xicons-react-native";
```
