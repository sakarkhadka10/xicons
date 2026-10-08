import type { CSSProperties } from "react";
import {
  DEFAULT_ICON_VARIANT,
  getIconSvg,
  type IconVariant,
} from "@axcore/xicons";

export interface IconProps {
  name: string;
  variant?: IconVariant;
  /** Pixel or CSS length. Omit when sizing via `className` (e.g. Tailwind `h-6 w-6`). */
  size?: number | string;
  color?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export function Icon({
  name,
  variant = DEFAULT_ICON_VARIANT,
  size,
  color,
  title,
  className,
  style,
}: IconProps) {
  const svg = getIconSvg(name, variant);

  if (!svg) {
    return null;
  }

  const html = svg.replace(/^<svg/, '<svg width="100%" height="100%"');

  const dimensionStyle: CSSProperties | undefined =
    size !== undefined
      ? {
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
        }
      : undefined;

  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
      style={{
        display: "inline-flex",
        flexShrink: 0,
        lineHeight: 0,
        ...(color !== undefined ? { color } : {}),
        ...dimensionStyle,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
