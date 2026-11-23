/**
 * Compiles `icons/ui/*.svg` into one tree-shakable ESM module (`dist/icons.js`) with an export per icon.
 *   tsx ../../scripts/build-ui-icons.ts svg   -> @axcore/xicons (raw icon data + static .svg copies)
 *   tsx ../../scripts/build-ui-icons.ts jsx   -> React / React Native components via ./createIcon.js
 * Run from the package directory after `tsc` (it overwrites the `src/icons.ts` stub output).
 */
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Attrs = Record<string, string>;
type Child = [tag: string, attrs: Attrs];

const iconsDir = join(dirname(fileURLToPath(import.meta.url)), "../icons/ui");

/** Root attributes every icon gets by default; per-icon data only stores differences. */
export const DEFAULT_ROOT: Attrs = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

const ATTR = /([\w:-]+)="([^"]*)"/g;
const CHILD = /<(path|circle|ellipse|rect|line|polyline|polygon)((?:\s+[\w:-]+="[^"]*")*)\s*\/>/gy;
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const parseAttrs = (s: string): Attrs =>
  Object.fromEntries([...s.matchAll(ATTR)].map((m) => [m[1]!, m[2]!]));

/** Only currentColor / none may paint, so icons follow the text color in light and dark themes. */
function assertThemeSafe(file: string, attrs: Attrs) {
  if ("style" in attrs) throw new Error(`${file}: inline style is not allowed`);
  for (const k of ["fill", "stroke", "color", "stop-color"]) {
    const v = attrs[k];
    if (v !== undefined && v !== "currentColor" && v !== "none") {
      throw new Error(`${file}: ${k}="${v}" is hard-coded and breaks dark mode; use currentColor`);
    }
  }
}

/** Parses a normalized icon SVG into [rootDiff, children]. Throws on anything outside the supported subset. */
export function parseIcon(file: string, svg: string): [Attrs, Child[]] {
  const m = /^<svg([^>]*)>([\s\S]*)<\/svg>\s*$/.exec(svg.trim());
  if (!m) throw new Error(`${file}: not a single <svg> element`);
  const { xmlns: _xmlns, width: _w, height: _h, ...rootAttrs } = parseAttrs(m[1]!);
  const effective = { ...DEFAULT_ROOT, ...rootAttrs };
  if (!/currentColor/.test(effective.fill! + effective.stroke!)) {
    throw new Error(`${file}: root must use currentColor for fill or stroke`);
  }
  if (effective.viewBox !== DEFAULT_ROOT.viewBox) {
    throw new Error(`${file}: icons must use the 24px grid (viewBox="0 0 24 24")`);
  }
  assertThemeSafe(file, rootAttrs);
  const root = Object.fromEntries(
    Object.entries(rootAttrs).filter(([k, v]) => DEFAULT_ROOT[k] !== v),
  );

  const body = m[2]!.trim();
  const children: Child[] = [];
  CHILD.lastIndex = 0;
  let end = 0;
  for (let c; (c = CHILD.exec(body)); end = CHILD.lastIndex) {
    // Drop child attributes that only repeat what the root already sets.
    const own = parseAttrs(c[2]!);
    assertThemeSafe(file, own);
    const attrs = Object.fromEntries(Object.entries(own).filter(([k, v]) => effective[k] !== v));
    children.push([c[1]!, attrs]);
  }
  if (end !== body.length || !children.length) {
    throw new Error(
      `${file}: only flat path/circle/ellipse/rect/line/polyline/polygon children are supported`,
    );
  }
  return [root, children];
}

const camel = (k: string) =>
  k.startsWith("data-") || k.startsWith("aria-")
    ? k
    : k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
const camelAttrs = (a: Attrs): Attrs =>
  Object.fromEntries(Object.entries(a).map(([k, v]) => [camel(k), v]));
export const exportName = (name: string) =>
  `Icon${name.replace(/(^|-)([a-z0-9])/g, (_, _d, c: string) => c.toUpperCase())}`;

if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2];
  if (mode !== "svg" && mode !== "jsx") throw new Error("usage: build-ui-icons.ts <svg|jsx>");

  const dist = join(process.cwd(), "dist");
  await rm(join(dist, "icons"), { recursive: true, force: true }); // output of older builds
  if (mode === "svg") {
    await rm(join(dist, "svg"), { recursive: true, force: true });
    await mkdir(join(dist, "svg"), { recursive: true });
  }

  const names = (await readdir(iconsDir))
    .filter((f) => f.endsWith(".svg"))
    .map((f) => f.slice(0, -4))
    .sort();
  const aliases = JSON.parse(await readFile(join(iconsDir, "aliases.json"), "utf8")) as Record<
    string,
    string
  >;

  const exportsSeen = new Map<string, string>();
  const claim = (name: string) => {
    if (!NAME.test(name)) throw new Error(`${name}: icon names must be kebab-case [a-z0-9-]`);
    const id = exportName(name);
    const prev = exportsSeen.get(id);
    if (prev) throw new Error(`${name} and ${prev} both export ${id}`);
    exportsSeen.set(id, name);
    return id;
  };

  // One module with every icon: Node loads a single file (fast SSR / cold starts), and bundlers
  // drop unused exports because each one is a literal or a /*#__PURE__*/ call.
  const barrel: string[] =
    mode === "svg" ? [] : ['import { createIcon as c } from "./createIcon.js";'];
  const types: string[] = [];
  const typeName = mode === "svg" ? "IconData" : "XIcon";
  const typeFrom = mode === "svg" ? "./ui.js" : "./createIcon.js";

  const parsed = await Promise.all(
    names.map(async (name) => {
      const file = join(iconsDir, `${name}.svg`);
      const data = parseIcon(`${name}.svg`, await readFile(file, "utf8"));
      if (mode === "svg") await copyFile(file, join(dist, "svg", `${name}.svg`));
      return data;
    }),
  );

  names.forEach((name, i) => {
    const [root, children] = parsed[i]!;
    const id = claim(name);
    barrel.push(
      mode === "svg"
        ? `export const ${id} = ${JSON.stringify([root, children])};`
        : `export const ${id} = /*#__PURE__*/ c(${JSON.stringify(name)}, ${JSON.stringify([
            camelAttrs(root),
            children.map(([t, a]) => [t, camelAttrs(a)]),
          ])});`,
    );
    types.push(`export declare const ${id}: ${typeName};`);
  });
  for (const [alias, target] of Object.entries(aliases)) {
    if (!names.includes(target)) throw new Error(`alias ${alias} -> missing icon ${target}`);
    const id = claim(alias);
    barrel.push(`export { ${exportName(target)} as ${id} };`);
    types.push(
      `/** @deprecated alias of ${exportName(target)} */ export declare const ${id}: ${typeName};`,
    );
  }

  const header = `/** Generated by scripts/build-ui-icons.ts: ${names.length} icons, ${Object.keys(aliases).length} aliases. */\n`;
  const typeImport = `import type { ${typeName} } from "${typeFrom}";\n`;
  await Promise.all([
    writeFile(join(dist, "icons.js"), header + barrel.join("\n") + "\n"),
    writeFile(join(dist, "icons.d.ts"), header + typeImport + types.join("\n") + "\n"),
    rm(join(dist, "icon.d.ts"), { force: true }), // output of older builds
    // Source maps for the src/icons.ts stub no longer match the generated barrel.
    rm(join(dist, "icons.js.map"), { force: true }),
    rm(join(dist, "icons.d.ts.map"), { force: true }),
    copyFile(join(iconsDir, "THIRD_PARTY_LICENSES.md"), join(dist, "THIRD_PARTY_LICENSES.md")),
  ]);

  console.log(`Built ${names.length} icons (+${Object.keys(aliases).length} aliases) -> ${dist}`);
}
