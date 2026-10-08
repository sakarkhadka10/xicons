# @axcore/xicons

Developer icon registry: **original** (brand) and **mono** (`currentColor`) SVG variants, typed for Node and bundlers.

## Install

```bash
npm install @axcore/xicons
```

## Example

```ts
import { getIconSvg, getIcon, hasIcon, listIcons } from "@axcore/xicons";

listIcons().map((i) => i.name);
getIconSvg("react", "mono");
getIcon("nextjs")?.title;
hasIcon("reactjs"); // alias → true
```

## API

| Function | Returns |
| --- | --- |
| `getIcon(name, variant?)` | `IconDefinition \| undefined` |
| `getIconSvg(name, variant?)` | SVG string or `undefined` |
| `hasIcon(name)` | `boolean` |
| `listIcons()` | readonly icon list |

**Variants:** `original` | `mono` (falls back to `original` when mono is absent)

**Helpers:** `parseViewBox`, `stripSvgWrapper`, `escapeXml`

## License

MIT. Third-party logos may be trademarks of their owners.
