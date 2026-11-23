# UI icons (12,000+)

XIcons ships **12,333 unique UI icons** (plus 330 aliases) next to the developer brand icons.
Every icon is its own ES module, so your bundle only contains the icons you import.

| Style                  | Naming         | Example            |
| ---------------------- | -------------- | ------------------ |
| Outline (stroke, 24px) | `name`         | `IconCamera`       |
| Filled                 | `name-filled`  | `IconCameraFilled` |
| Duotone                | `name-duotone` | `IconAcornDuotone` |

Export names are `Icon` + PascalCase file name. Browse all names in [`icons/ui`](../icons/ui).

## House style

Every icon in the set follows the same rules, so any two icons sit together cleanly:

- **24 × 24 grid**: one viewBox for everything.
- **One stroke weight (1.75)** with round caps and joins. `strokeWidth` or Tailwind `stroke-[…]` retunes every outline icon at once.
- **Soft corners**: every sharp line-to-line corner is eased with a small curve (1px on outlines, 0.6px on fills),
  so arrows, chevrons, checks and polygons share one gentle geometry.
- **Core set drawn from scratch**: the 50 most-used icons (navigation, arrows, actions, people, files, settings…)
  use an 18px live area (3–21) and a 3px container radius.
- **Three families**: outline (stroked), filled and duotone (a 20% tint behind the outline).
- **Clean paths**: 2-decimal coordinates, no groups, masks, transforms or editor metadata.

## Light and dark mode

Icons only ever paint with `currentColor` (the build rejects hard-coded colors and inline styles).
They take the surrounding text color, so they switch with your theme and need no extra classes:

```tsx
<p className="text-zinc-900 dark:text-zinc-100">
  <IconBell /> {/* dark in light mode, light in dark mode */}
</p>
```

The duotone tint uses `opacity`, so it adapts too. In brand icons, neutral ink (black or white wordmarks) also uses
`currentColor`. Only the real brand colors stay fixed.

## React

```tsx
import { IconCamera, IconHeartFilled } from "@axcore/xicons-react";

<IconCamera />                                        // 24px, currentColor, stroke 1.75
<IconCamera size={20} strokeWidth={1.5} />
<IconCamera className="size-5 text-sky-500 stroke-[1.5]" />  // Tailwind: CSS beats the attributes
<IconHeartFilled title="Favourite" />                  // titled → role="img", otherwise aria-hidden
```

Every icon accepts all `<svg>` props (`ref`, `onClick`, `style`, `aria-*`, …) and renders
`class="xi xi-<name> …"` so you can target icons globally (`.xi { … }`).

## React Native / Expo

```tsx
import { IconCamera } from "@axcore/xicons-react-native";

<IconCamera size={24} color="#0ea5e9" strokeWidth={1.5} />;
```

## Vanilla JS / SSR / any framework

```ts
import { IconCamera, toSvg } from "@axcore/xicons";

el.innerHTML = toSvg(IconCamera, {
  class: "size-5 text-sky-500",
  "stroke-width": 1.5,
});
```

## Plain HTML / CDN

Optimized static files ship in the package:

```html
<img
  src="https://cdn.jsdelivr.net/npm/@axcore/xicons/dist/svg/camera.svg"
  width="24"
  height="24"
  alt=""
/>
```

## Bundle size

Each icon is ~300 bytes of path data. Measured with esbuild (`--bundle --minify`, react external):

| Import                                             | Minified | Gzip    |
| -------------------------------------------------- | -------- | ------- |
| `IconCamera` + `IconHeartFilled` from xicons-react | 1.0 kB   | 0.66 kB |
| `IconCamera` + `toSvg` from `@axcore/xicons`       | 0.75 kB  | —       |

All icons live in one ES module per package. Each export is a plain literal or a `/*#__PURE__*/` call, and every
package declares `"sideEffects": false`, so bundlers keep only the icons you import. Because it's a single file,
Node loads it fast too: importing `@axcore/xicons` takes about 50 ms, which matters for SSR and serverless cold starts.

## Adding an icon

Convert any SVG, from Figma, another tool or your own drawing, into the house style:

```bash
pnpm icons:add ~/Downloads/cloud-sync.svg            # name comes from the file name
pnpm icons:add drawing.svg --name rocket-launch      # explicit name
```

The converter scales the icon to the 24px grid and turns colors into `currentColor`. It applies the house stroke and soft corners,
optimizes the paths and writes `icons/ui/<name>.svg`. It rejects anything that would break the rules
(masks, gradients, images). Then run `pnpm build`.

To re-apply the house style to the whole set after changing a rule, run `pnpm icons:add --restyle-all`.

Icons ending in `-filled` or `-duotone` belong to those families. Keep the outline and filled versions of an icon
visually matched.

License notices for adapted artwork are in `icons/ui/THIRD_PARTY_LICENSES.md`. Keep that file, because it ships with the packages.
