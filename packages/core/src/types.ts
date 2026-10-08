import { iconCategories, type IconCategory } from "./categories.js";

export { iconCategories, type IconCategory };

export type IconVariant = "original" | "mono";

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
  };
}

export type IconName = string;
