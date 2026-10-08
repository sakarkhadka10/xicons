import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { iconCategories } from "../../../packages/core/src/categories.js";
import {
  assertAliasAvailable,
  assertCanonicalNameAvailable,
  assertIconMetadata,
  assertSvg,
} from "../../../packages/core/scripts/validate-icon.js";

const iconsRoot = join(dirname(fileURLToPath(import.meta.url)), "../../../icons");

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const entries = await readdir(iconsRoot, { withFileTypes: true });
const iconDirs = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (!iconDirs.length) {
  throw new Error("No icon directories found.");
}

const names = new Set<string>();
const aliases = new Set<string>();
let svgCount = 0;

for (const dirName of iconDirs) {
  const iconDir = join(iconsRoot, dirName);
  const metadataPath = join(iconDir, "metadata.json");

  if (!(await exists(metadataPath))) {
    throw new Error(`${dirName}: missing metadata.json`);
  }

  const metadata = JSON.parse(await readFile(metadataPath, "utf8")) as unknown;
  const meta = assertIconMetadata(dirName, metadata, iconCategories);
  assertCanonicalNameAvailable(meta.name, names, aliases);

  for (const alias of meta.aliases) {
    assertAliasAvailable(meta.name, alias, names, aliases);
  }

  for (const variant of ["original", "mono", "branded"] as const) {
    const filePath = join(iconDir, `${variant}.svg`);
    if (!(await exists(filePath))) {
      if (variant === "original") {
        throw new Error(`${dirName}: missing original.svg`);
      }
      continue;
    }

    const svg = (await readFile(filePath, "utf8")).trim();
    assertSvg(`${dirName}/${variant}.svg`, svg, {
      requireCurrentColor: variant === "mono",
    });
    svgCount += 1;
  }
}

console.log(`Validated ${iconDirs.length} icon(s) and ${svgCount} SVG file(s).`);
