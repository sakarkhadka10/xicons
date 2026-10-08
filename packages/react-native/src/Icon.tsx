import {
  DEFAULT_ICON_VARIANT,
  getIconSvg,
  type IconVariant,
} from "@axcore/xicons";
import { SvgXml } from "react-native-svg";

export interface IconProps {
  name: string;
  variant?: IconVariant;
  size?: number;
  color?: string;
}

export function Icon({
  name,
  variant = DEFAULT_ICON_VARIANT,
  size = 24,
  color,
}: IconProps) {
  const svg = getIconSvg(name, variant);

  if (!svg) {
    return null;
  }

  const xml =
    variant === "mono" && color ? svg.replaceAll("currentColor", color) : svg;

  return <SvgXml xml={xml} width={size} height={size} />;
}
