import { icons } from "./icons.generated.js";
import {
  DEFAULT_ICON_VARIANT,
  type IconDefinition,
  type IconName,
  type IconVariant,
} from "./types.js";

function resolveIcon(name: IconName): IconDefinition | undefined {
  const normalized = name.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }

  return (
    icons[normalized] ??
    Object.values(icons).find((item) =>
      item.aliases?.some((alias) => alias.toLowerCase() === normalized),
    )
  );
}

/** Pick SVG markup for a variant, with sensible fallbacks when optional files are absent. */
export function resolveIconSvg(
  icon: IconDefinition,
  variant: IconVariant,
): string {
  const { variants } = icon;

  switch (variant) {
    case "mono":
      return variants.mono ?? variants.original;
    case "branded":
      return variants.branded ?? variants.original;
    case "original":
      return variants.original;
  }
}

export function getIcon(
  name: IconName,
  variant: IconVariant = DEFAULT_ICON_VARIANT,
): IconDefinition | undefined {
  const icon = resolveIcon(name);
  if (!icon) {
    return undefined;
  }

  if (
    (variant === "mono" && !icon.variants.mono) ||
    (variant === "branded" && !icon.variants.branded)
  ) {
    return icon;
  }

  if (variant === "original" || icon.variants[variant]) {
    return icon;
  }

  return icon;
}

export function getIconSvg(
  name: IconName,
  variant: IconVariant = DEFAULT_ICON_VARIANT,
): string | undefined {
  const icon = getIcon(name, variant);
  if (!icon) {
    return undefined;
  }

  return resolveIconSvg(icon, variant);
}

export function hasIcon(name: IconName): boolean {
  return Boolean(resolveIcon(name));
}

export function listIcons(): readonly IconDefinition[] {
  return Object.values(icons);
}
