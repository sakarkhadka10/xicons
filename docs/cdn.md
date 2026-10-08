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

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | `{ "ok": true, "service": "xicons-cdn" }` |
| `GET` | `/icons` | SVG sprite strip |

## URL shape

After you deploy the server, the icon route is:

```text
https://<your-host>/icons?i=react,nextjs&size=48&gap=12
```

## `/icons` query parameters

| Param | Default | Range | Description |
| --- | --- | --- | --- |
| `i` | — | max 50 names | Comma-separated icon names or aliases |
| `variant` | `original` | `original`, `mono` | Which SVG variant to draw. Any other value is treated as `original`. |
| `size` | `48` | 16–512 | Each icon cell size (px) |
| `gap` | `12` | 0–128 | Horizontal gap between icons (px) |

Unknown names in `i` are skipped. If none resolve, the response is a minimal 1×1 SVG.

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
<img
  src="https://<your-host>/icons?i=react,nextjs&size=48"
  alt="React and Next.js"
  height="48"
/>
```

## Caching

Responses include:

```text
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/svg+xml; charset=utf-8
```

Use versioned CDN URLs or cache-bust query params when you change icon assets in self-hosted setups.

## Self-hosting

The reference app lives in `apps/cdn` (`@axcore/xicons-cdn`). Build `@axcore/xicons`, then run the Hono server behind your reverse proxy. It imports the same registry as npm packages.
