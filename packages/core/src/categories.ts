export const iconCategories = [
  "language",
  "framework",
  "library",
  "runtime",
  "database",
  "cloud",
  "devops",
  "tool",
  "editor",
  "design",
  "mobile",
  "ai",
  "platform",
  "other",
] as const;

export type IconCategory = (typeof iconCategories)[number];
