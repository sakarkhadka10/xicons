# @axcore/xicons-react-native

React Native / Expo icon component for XIcons.

## Install

```bash
npm install @axcore/xicons-react-native react-native-svg
```

Peers: **react** ^19.3.0, **react-native** ≥ 0.78

## Example

```tsx
import { Icon } from "@axcore/xicons-react-native";

<Icon name="react" size={28} />;
<Icon name="react" variant="mono" size={28} color="#61DAFB" />;
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Icon name or alias |
| `variant` | `"original"` \| `"mono"` | `"original"` | Color style |
| `size` | `number` | `24` | Width and height |
| `color` | `string` | — | Replaces `currentColor` when `variant="mono"` |

## License

MIT
