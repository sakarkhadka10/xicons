export type IconCategory =
  | "language"
  | "framework"
  | "library"
  | "runtime"
  | "database"
  | "cloud"
  | "devops"
  | "tool"
  | "editor"
  | "design"
  | "mobile"
  | "ai"
  | "platform"
  | "other";

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
