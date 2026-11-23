import { createElement } from "react";

export function SvgXml(props: Record<string, unknown>) {
  return createElement("xicons-svg", props);
}

const host = (tag: string) => (props: Record<string, unknown>) => createElement(tag, props);

export default host("rn-svg");
export const Path = host("rn-path");
export const Circle = host("rn-circle");
export const Ellipse = host("rn-ellipse");
export const Rect = host("rn-rect");
export const Line = host("rn-line");
export const Polyline = host("rn-polyline");
export const Polygon = host("rn-polygon");
