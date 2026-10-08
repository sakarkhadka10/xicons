const VIEW_BOX_PATTERN = /viewBox=["']([^"']+)["']/;

export function parseViewBox(svg: string, fallback = "0 0 24 24"): string {
  return svg.match(VIEW_BOX_PATTERN)?.[1] ?? fallback;
}

export function stripSvgWrapper(svg: string): string {
  return svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
