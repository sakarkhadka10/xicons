import { escapeXml } from "./svg.js";

export type IconAttrs = Readonly<Record<string, string>>;

/** Compact UI icon data: root attributes that differ from `defaultIconAttrs`, then flat children. */
export type IconData = readonly [
  root: IconAttrs,
  children: readonly (readonly [tag: string, attrs: IconAttrs])[],
];

export const defaultIconAttrs: IconAttrs = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

const attrs = (o: Readonly<Record<string, string | number>>) =>
  Object.entries(o)
    .map(([k, v]) => ` ${k}="${escapeXml(String(v))}"`)
    .join("");

/**
 * Renders icon data to an SVG string.
 * @example toSvg(IconCamera, { class: "size-5 text-sky-500", "stroke-width": 1.5 })
 */
export function toSvg(
  [root, children]: IconData,
  overrides: Readonly<Record<string, string | number>> = {},
): string {
  return `<svg${attrs({ ...defaultIconAttrs, ...root, ...overrides })}>${children
    .map(([tag, a]) => `<${tag}${attrs(a)}/>`)
    .join("")}</svg>`;
}
