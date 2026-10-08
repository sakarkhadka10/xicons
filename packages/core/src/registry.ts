import { icons } from "./icons.generated.js";
import type { IconDefinition, IconName, IconVariant } from "./types.js";

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

export function getIcon(
  name: IconName,
  variant: IconVariant = "original",
): IconDefinition | undefined {
  const icon = resolveIcon(name);
  if (!icon) {
    return undefined;
  }

  if (variant === "mono" && !icon.variants.mono) {
    return icon;
  }

  if (variant === "original" || icon.variants[variant]) {
    return icon;
  }

  return icon;
}

export function getIconSvg(
  name: IconName,
  variant: IconVariant = "original",
): string | undefined {
  const icon = getIcon(name, variant);
  if (!icon) {
    return undefined;
  }

  return icon.variants[variant] ?? icon.variants.original;
}

export function hasIcon(name: IconName): boolean {
  return Boolean(resolveIcon(name));
}

export function listIcons(): readonly IconDefinition[] {
  return Object.values(icons);
}
