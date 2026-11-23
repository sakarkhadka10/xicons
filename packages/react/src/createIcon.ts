import { createElement, type ReactElement, type SVGProps } from "react";

type Attrs = Readonly<Record<string, string>>;
type IconData = readonly [root: Attrs, children: readonly (readonly [tag: string, attrs: Attrs])[]];

export interface XIconProps extends SVGProps<SVGSVGElement> {
  /** Width and height. Omit and use Tailwind (`size-5`) instead if you prefer: CSS wins over the attribute. */
  size?: number | string;
  /** Accessible label. Without it the icon is decorative (`aria-hidden`). */
  title?: string;
}

export type XIcon = ((props: XIconProps) => ReactElement) & {
  displayName?: string;
};

const defaults = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Builds an icon component. Children elements are created once and reused on every render. */
export function createIcon(name: string, [root, children]: IconData): XIcon {
  const kids = children.map(([tag, attrs]) => createElement(tag, attrs));
  const base = `xi xi-${name}`;

  const Icon: XIcon = ({ size = 24, title, className, children: extra, ...props }) =>
    createElement(
      "svg",
      {
        ...defaults,
        ...root,
        width: size,
        height: size,
        className: className ? `${base} ${className}` : base,
        "aria-hidden": title ? undefined : true,
        role: title ? "img" : undefined,
        ...props,
      },
      title ? createElement("title", null, title) : null,
      ...kids,
      extra,
    );

  Icon.displayName = name;
  return Icon;
}
