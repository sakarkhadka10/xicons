import {
  DEFAULT_CDN_VARIANT,
  escapeXml,
  getIcon,
  parseViewBox,
  resolveIconSvg,
  stripSvgWrapper,
  type IconVariant,
} from "@axcore/xicons";

export interface RenderOptions {
  names: string[];
  variant?: IconVariant;
  size?: number;
  gap?: number;
}

export function renderIcons({
  names,
  variant = DEFAULT_CDN_VARIANT,
  size = 48,
  gap = 12,
}: RenderOptions): string {
  const icons = names.map((name) => getIcon(name, variant)).filter(Boolean);

  if (!icons.length) {
    return emptySvg();
  }

  const width = icons.length * size + Math.max(0, icons.length - 1) * gap;

  const body = icons
    .map((icon, index) => {
      const x = index * (size + gap);
      const svg = resolveIconSvg(icon!, variant);
      const viewBox = parseViewBox(svg);
      const inner = stripSvgWrapper(svg);

      return `<svg x="${x}" y="0" width="${size}" height="${size}" viewBox="${viewBox}" aria-label="${escapeXml(icon!.title)}">${inner}</svg>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${size}" viewBox="0 0 ${width} ${size}">${body}</svg>`;
}

function emptySvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"></svg>`;
}
