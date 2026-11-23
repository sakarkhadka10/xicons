import {
  DEFAULT_CDN_VARIANT,
  escapeXml,
  getIcon,
  resolveIconSvg,
  toSvg,
  type IconData,
  type IconVariant,
} from "@axcore/xicons";
import * as uiIcons from "@axcore/xicons/icons";

export interface RenderOptions {
  names: string[];
  variant?: IconVariant;
  size?: number;
  gap?: number;
  /** Hex color (without #) for currentColor parts: mono brand icons and every UI icon. */
  color?: string;
}

const ui = uiIcons as unknown as Record<string, IconData>;
const uiExport = (name: string) =>
  `Icon${name.replace(/(^|-)([a-z0-9])/g, (_, _d, c: string) => c.toUpperCase())}`;

/** Brand icons first (they have variants), then the UI set. */
function resolve(name: string, variant: IconVariant): { svg: string; label: string } | undefined {
  const brand = getIcon(name, variant);
  if (brand) return { svg: resolveIconSvg(brand, variant), label: brand.title };
  const data = /^[a-z0-9-]+$/.test(name) ? ui[uiExport(name)] : undefined;
  return data ? { svg: toSvg(data), label: name } : undefined;
}

/** Nests a whole icon (root attributes included, so fills/strokes survive) at one cell of the strip. */
function place(svg: string, x: number, size: number, label: string): string {
  return svg.replace(
    /^<svg([^>]*)>/,
    (_, attrs: string) =>
      `<svg${attrs.replace(/\s(width|height|x|y)="[^"]*"/g, "")} x="${x}" y="0" width="${size}" height="${size}" aria-label="${escapeXml(label)}">`,
  );
}

export function renderIcons({
  names,
  variant = DEFAULT_CDN_VARIANT,
  size = 48,
  gap = 12,
  color,
}: RenderOptions): string {
  const icons = names.map((name) => resolve(name, variant)).filter((icon) => icon !== undefined);

  if (!icons.length) {
    return emptySvg();
  }

  const width = icons.length * size + Math.max(0, icons.length - 1) * gap;
  const body = icons
    .map(({ svg, label }, index) => place(svg.trim(), index * (size + gap), size, label))
    .join("");
  const paint = color && /^[0-9a-f]{3,8}$/i.test(color) ? ` color="#${color}"` : "";

  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${size}" viewBox="0 0 ${width} ${size}"${paint}>${body}</svg>`;
}

function emptySvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"></svg>`;
}
