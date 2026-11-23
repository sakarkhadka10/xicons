# CDN & URL embedding

Compose multiple icons into **one SVG** for a README, docs page, or `<img>` tag.

This repository includes the server. It does not publish a hosted CDN. `xicons.dev` does not resolve. Run the local server below, or deploy `apps/cdn` and use your own origin.

## Local server

From the monorepo:

```bash
pnpm --filter @axcore/xicons-cdn dev
```

Base URL: `http://localhost:8787`

## Endpoints

| Method | Path      | Description                               |
| ------ | --------- | ----------------------------------------- |
| `GET`  | `/health` | `{ "ok": true, "service": "xicons-cdn" }` |
| `GET`  | `/icons`  | SVG sprite strip                          |

## URL shape

After you deploy the server, the icon route is:

```text
https://<your-host>/icons?i=react,nextjs&size=48&gap=12
```

## `/icons` query parameters

| Param     | Default   | Range                         | Description                                                             |
| --------- | --------- | ----------------------------- | ----------------------------------------------------------------------- |
| `i`       | —         | max 50 names                  | Comma-separated brand **or UI** icon names (e.g. `react,camera,bell`)   |
| `variant` | `branded` | `branded`, `original`, `mono` | Which SVG variant to draw. Omit or pass an unknown value for `branded`. |
| `size`    | `48`      | 16–512                        | Each icon cell size (px)                                                |
| `gap`     | `12`      | 0–128                         | Horizontal gap between icons (px)                                       |
| `color`   | —         | hex, `#` optional             | Color for `currentColor` parts (UI icons and mono brand icons)          |

Brand names win over UI names; unknown names in `i` are skipped. If none resolve, the response is a minimal 1×1 SVG.

## Examples

```text
/icons?i=react
/icons?i=react,nextjs&size=32&gap=8
/icons?i=reactjs,next&variant=mono&size=64
```

Markdown:

```md
![My stack](http://localhost:8787/icons?i=react,nextjs&size=32&gap=10)
```

HTML, using a host you deploy:

```html
<img src="https://<your-host>/icons?i=react,nextjs&size=48" alt="React and Next.js" height="48" />
```

## Caching

Responses include:

```text
Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400
Content-Type: image/svg+xml; charset=utf-8
```

Browsers cache for a day and shared caches for a week, so redrawn icons reach README badges after a release.

### Light and dark READMEs

`<img>` icons can't read the page theme, so render one per theme with GitHub's theme fragments:

```md
![stack](https://<your-host>/icons?i=react,camera&color=18181b#gh-light-mode-only)
![stack](https://<your-host>/icons?i=react,camera&color=e4e4e7#gh-dark-mode-only)
```

For a single static icon, you don't need the server: `https://cdn.jsdelivr.net/npm/@axcore/xicons/dist/svg/<name>.svg`.

## Self-hosting

The reference app lives in `apps/cdn` (`@axcore/xicons-cdn`). Build `@axcore/xicons`, then run the Hono server behind your reverse proxy. It imports the same registry as npm packages.
