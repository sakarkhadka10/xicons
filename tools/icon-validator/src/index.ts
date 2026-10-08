import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const iconsRoot = join(dirname(fileURLToPath(import.meta.url)), "../../../icons");

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function validateSvg(relativePath: string, svg: string): void {
  if (!svg.trim().startsWith("<svg")) {
    throw new Error(`${relativePath}: must start with <svg`);
  }
  if (!svg.includes("viewBox=")) {
    throw new Error(`${relativePath}: missing viewBox`);
  }
}

const entries = await readdir(iconsRoot, { withFileTypes: true });
const iconDirs = entries.filter((entry) => entry.isDirectory());

if (!iconDirs.length) {
  throw new Error("No icon directories found.");
}

let svgCount = 0;

for (const dirent of iconDirs) {
  const dirName = dirent.name;
  const iconDir = join(iconsRoot, dirName);
  const metadataPath = join(iconDir, "metadata.json");

  if (!(await exists(metadataPath))) {
    throw new Error(`${dirName}: missing metadata.json`);
  }

  const metadata = JSON.parse(await readFile(metadataPath, "utf8")) as {
    name?: string;
  };

  if ((metadata.name ?? dirName) !== dirName) {
    throw new Error(`${dirName}/metadata.json: name must match directory`);
  }

  const originalPath = join(iconDir, "original.svg");
  if (!(await exists(originalPath))) {
    throw new Error(`${dirName}: missing original.svg`);
  }

  for (const variant of ["original", "mono"] as const) {
    const filePath = join(iconDir, `${variant}.svg`);
    if (!(await exists(filePath))) {
      if (variant === "original") {
        throw new Error(`${dirName}: missing original.svg`);
      }
      continue;
    }

    const svg = await readFile(filePath, "utf8");
    validateSvg(`${dirName}/${variant}.svg`, svg);
    svgCount += 1;
  }
}

console.log(`Validated ${iconDirs.length} icon(s) and ${svgCount} SVG file(s).`);
