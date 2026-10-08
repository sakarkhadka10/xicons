import { iconCategories, type IconCategory } from "./categories.js";

export { iconCategories, type IconCategory };

export type IconVariant = "original" | "mono" | "branded";

/** Default for npm packages, React, and direct `getIconSvg()` usage. */
export const DEFAULT_ICON_VARIANT = "mono" satisfies IconVariant;

/** Default for the CDN `/icons` endpoint (full-color badge artwork). */
export const DEFAULT_CDN_VARIANT = "branded" satisfies IconVariant;

export interface IconMetadata {
  readonly name: string;
  readonly title: string;
  readonly category: IconCategory;
  readonly website?: string;
  readonly aliases?: readonly string[];
}

export interface IconDefinition extends IconMetadata {
  readonly variants: {
    readonly original: string;
    readonly mono?: string;
    readonly branded?: string;
  };
}

export type IconName = string;
