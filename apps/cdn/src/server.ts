import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { DEFAULT_CDN_VARIANT, type IconVariant } from "@axcore/xicons";
import { renderIcons } from "./renderer.js";

const app = new Hono();

app.get("/health", (c) => c.json({ ok: true, service: "xicons-cdn" }));

app.get("/icons", (c) => {
  const names = (c.req.query("i") ?? "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 50);

  const variant = parseCdnVariant(c.req.query("variant"));

  const size = Math.min(
    Math.max(Number(c.req.query("size") ?? 48) || 48, 16),
    512,
  );

  const gap = Math.min(
    Math.max(Number(c.req.query("gap") ?? 12) || 12, 0),
    128,
  );

  const svg = renderIcons({ names, variant, size, gap });

  return c.body(svg, 200, {
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });
});

function parseCdnVariant(value: string | undefined): IconVariant {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === "mono" ||
    normalized === "original" ||
    normalized === "branded"
  ) {
    return normalized;
  }
  return DEFAULT_CDN_VARIANT;
}

const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port });

console.log(`XIcons CDN listening on http://localhost:${port}`);
