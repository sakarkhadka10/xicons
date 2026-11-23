/**
 * Converts any SVG into the XIcons house style and adds it to `icons/ui/`.
 *   pnpm icons:add path/to/icon.svg [more.svg ...]      name = file name
 *   pnpm icons:add path/to/icon.svg --name cloud-sync   explicit name (single file)
 *   --force overwrites an existing icon
 *   pnpm icons:add --restyle-all                        re-applies the house style to every icon in icons/ui
 *   pnpm icons:check                                    fails if any icon is not in the house style (CI + pre-commit)
 */
import { access, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";
import { DEFAULT_ROOT, exportName, parseIcon } from "./build-ui-icons.js";
import { softenPath } from "./soften.js";

/** Corner radius of the soft-corner signature, in 24px grid units. Fills get a tighter radius to keep small details crisp. */
const SOFT_OUTLINE = 1;
const SOFT_FILLED = 0.6;

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../icons/ui");

/** The XIcons house style. Every added icon is redrawn onto it. */
const OUTLINE_ROOT = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": DEFAULT_ROOT["stroke-width"]!,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};
const FILLED_ROOT = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: "none",
};

const ATTR = /([\w:-]+)="([^"]*)"/g;

function svgo(raw: string): { root: Record<string, string>; body: string } {
  const { data } = optimize(raw, {
    multipass: true,
    floatPrecision: 2,
    plugins: [
      {
        name: "preset-default",
        params: { overrides: { convertShapeToPath: { convertArcs: true } } },
      },
      "removeDimensions",
      {
        name: "removeAttrs",
        params: { attrs: ["class", "data-.*", "aria-.*"] },
      },
      {
        // Drop invisible full-canvas "bounding box" paths that many icon tools export.
        name: "removeBoundingBox",
        fn: () => ({
          element: {
            enter: (node, parent) => {
              if (node.name === "path" && node.attributes.d === "M0 0h24v24H0z") {
                parent.children = parent.children.filter((c) => c !== node);
              }
            },
          },
        }),
      },
    ],
  });
  const match = /^<svg([^>]*)>([\s\S]*)<\/svg>$/.exec(data.trim());
  if (!match?.[2]) throw new Error(`Unexpected SVG output: ${data.slice(0, 120)}`);
  const root = Object.fromEntries([...match[1]!.matchAll(ATTR)].map((m) => [m[1]!, m[2]!]));
  delete root.xmlns;
  return { root, body: match[2] };
}

/**
 * Redraws any SVG in the house style: 24px grid, one stroke weight, round caps and joins,
 * soft corners, 2-decimal coordinates and currentColor only (so it follows light and dark themes).
 */
export function normalize(raw: string): string {
  // Monochrome conversion: every painted color becomes currentColor, and per-shape weights go
  // (the house weight replaces them), so scaling never has to touch stroke widths.
  let { root, body } = svgo(
    raw
      .replace(/ (fill|stroke)="(?!none"|currentColor")[^"]*"/g, ' $1="currentColor"')
      .replace(/ stroke-width="[^"]*"/g, ""),
  );

  const size = Number(root.viewBox?.split(/\s+/)[2] ?? 24);
  if (size !== 24) {
    // Bake a scale into the path data so every set shares one 24px grid.
    const { viewBox: _v, ...rest } = root;
    const attrs = Object.entries(rest)
      .map(([k, v]) => ` ${k}="${v}"`)
      .join("");
    ({ root, body } = svgo(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"${attrs}><g transform="scale(${24 / size})">${body}</g></svg>`,
    ));
  }

  const outline = root.stroke === "currentColor" || /stroke="currentColor"/.test(body);
  body = outline
    ? body
        // One stroke weight for the whole set; strokeWidth / Tailwind stroke-* then tune every icon at once.
        .replace(/ stroke-width="[^"]*"/g, "")
        .replace(/ stroke="currentColor"/g, "")
        .replace(/ stroke-line(cap|join)="round"/g, "")
    : body.replace(/ fill="currentColor"/g, "");

  const radius = outline ? SOFT_OUTLINE : SOFT_FILLED;
  body = body.replace(/ d="([^"]*)"/g, (_, d: string) => ` d="${softenPath(d, radius)}"`);

  const attrs = Object.entries(outline ? OUTLINE_ROOT : FILLED_ROOT)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join("");
  // Final pass compacts the softened paths; the root template is written back unchanged.
  ({ body } = svgo(`<svg xmlns="http://www.w3.org/2000/svg"${attrs}>${body}</svg>`));
  return `<svg xmlns="http://www.w3.org/2000/svg"${attrs}>${body}</svg>\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args[0] === "--check") {
    const names = (await readdir(outDir)).filter((f) => f.endsWith(".svg"));
    const bad: string[] = [];
    await Promise.all(
      names.map(async (f) => {
        const svg = await readFile(join(outDir, f), "utf8");
        try {
          parseIcon(f, svg);
          if (normalize(svg) !== svg) bad.push(`${f}: not in the house style`);
        } catch (e) {
          bad.push(String((e as Error).message));
        }
      }),
    );
    if (bad.length) {
      console.error(bad.sort().join("\n"));
      console.error(
        `\n${bad.length} icon(s) need fixing. Run: pnpm icons:add --force <file.svg> (or --restyle-all)`,
      );
      process.exit(1);
    }
    console.log(`${names.length} icons are in the house style`);
    process.exit(0);
  }
  if (args[0] === "--restyle-all") {
    const names = (await readdir(outDir)).filter((f) => f.endsWith(".svg"));
    await Promise.all(
      names.map(async (f) => {
        const svg = normalize(await readFile(join(outDir, f), "utf8"));
        parseIcon(f, svg);
        await writeFile(join(outDir, f), svg);
      }),
    );
    console.log(`Restyled ${names.length} icons`);
    process.exit(0);
  }
  const force = args.includes("--force");
  const nameAt = args.indexOf("--name");
  const explicit = nameAt >= 0 ? args[nameAt + 1] : undefined;
  const files = args.filter((a, i) => !a.startsWith("--") && !(nameAt >= 0 && i === nameAt + 1));
  if (!files.length || (explicit && files.length > 1)) {
    throw new Error("usage: pnpm icons:add <file.svg...> [--name kebab-name] [--force]");
  }

  for (const file of files) {
    const name =
      explicit ??
      basename(file, ".svg")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const target = join(outDir, `${name}.svg`);
    if (
      !force &&
      (await access(target).then(
        () => true,
        () => false,
      ))
    ) {
      throw new Error(`${name} already exists (use --force to replace it)`);
    }
    const svg = normalize(await readFile(file, "utf8"));
    parseIcon(`${name}.svg`, svg); // rejects masks, gradients, hard-coded colors, non-kebab names
    await writeFile(target, svg);
    console.log(`Added ${exportName(name)} -> icons/ui/${name}.svg`);
  }
}
