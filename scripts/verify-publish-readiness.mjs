import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const PUBLISH_PACKAGES = [
  { dir: "packages/core", name: "@axcore/xicons", required: ["dist/index.js", "dist/index.d.ts"] },
  {
    dir: "packages/react",
    name: "@axcore/xicons-react",
    required: ["dist/index.js", "dist/index.d.ts", "dist/Icon.js"],
  },
  {
    dir: "packages/react-native",
    name: "@axcore/xicons-react-native",
    required: ["dist/index.js", "dist/index.d.ts", "dist/Icon.js"],
  },
];

const FORBIDDEN_PREFIXES = ["node_modules/", "src/", "test/", "coverage/", ".env"];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function assertPackageMetadata(dir, expectedName) {
  const pkg = readJson(join(dir, "package.json"));
  if (pkg.private) {
    throw new Error(`${expectedName}: must not be private`);
  }
  if (pkg.name !== expectedName) {
    throw new Error(`${dir}: expected name ${expectedName}, got ${pkg.name}`);
  }
  if (!pkg.license) {
    throw new Error(`${expectedName}: missing license`);
  }
  if (!pkg.exports?.["."]?.import || !pkg.exports?.["."]?.types) {
    throw new Error(`${expectedName}: missing exports["."].import/types`);
  }
  if (!Array.isArray(pkg.files) || !pkg.files.includes("dist")) {
    throw new Error(`${expectedName}: files must include dist`);
  }
}

function listTarPaths(tgzPath) {
  const out = execFileSync("tar", ["-tzf", tgzPath], { encoding: "utf8" });
  return out.split("\n").filter(Boolean);
}

const versions = new Set();

for (const pkg of PUBLISH_PACKAGES) {
  assertPackageMetadata(pkg.dir, pkg.name);
  const meta = readJson(join(pkg.dir, "package.json"));
  versions.add(meta.version);

  const tmp = mkdtempSync(join(tmpdir(), "xicons-pack-"));
  try {
    execFileSync("pnpm", ["pack", "--pack-destination", tmp], {
      cwd: pkg.dir,
      stdio: "pipe",
    });
    const artifact = readdirSync(tmp).find((f) => f.endsWith(".tgz"));
    if (!artifact) {
      throw new Error(`${pkg.name}: pnpm pack produced no tarball`);
    }
    const paths = listTarPaths(join(tmp, artifact));
    for (const required of pkg.required) {
      const found = paths.some((p) => p.endsWith(`/${required}`) || p.endsWith(required));
      if (!found) {
        throw new Error(`${pkg.name}: tarball missing ${required}`);
      }
    }
    for (const forbidden of FORBIDDEN_PREFIXES) {
      if (paths.some((p) => p.includes(`/${forbidden}`) || p.startsWith(`package/${forbidden}`))) {
        throw new Error(`${pkg.name}: tarball contains forbidden path prefix ${forbidden}`);
      }
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (versions.size !== 1) {
  throw new Error(
    `Publish packages must share one version; found: ${[...versions].join(", ")}`,
  );
}

console.log(`Pack verification passed for ${PUBLISH_PACKAGES.length} packages (v${[...versions][0]}).`);
