import { createElement, type ComponentType, type ReactElement } from "react";
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  type SvgProps,
} from "react-native-svg";

type Attrs = Readonly<Record<string, string>>;
type IconData = readonly [root: Attrs, children: readonly (readonly [tag: string, attrs: Attrs])[]];

export interface XIconProps extends SvgProps {
  size?: number | string;
}

export type XIcon = ((props: XIconProps) => ReactElement) & {
  displayName?: string;
};

const elements: Record<string, ComponentType<Record<string, string>>> = {
  path: Path,
  circle: Circle,
  ellipse: Ellipse,
  rect: Rect,
  line: Line,
  polyline: Polyline,
  polygon: Polygon,
} as never;

const defaults = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Builds an icon component. `color` sets currentColor for both stroke and fill icons. */
export function createIcon(name: string, [root, children]: IconData): XIcon {
  const kids = children.map(([tag, attrs]) => createElement(elements[tag]!, attrs));

  const Icon: XIcon = ({ size = 24, children: extra, ...props }) =>
    createElement(
      Svg,
      { ...defaults, ...root, width: size, height: size, ...props },
      ...kids,
      extra,
    );

  Icon.displayName = name;
  return Icon;
}
