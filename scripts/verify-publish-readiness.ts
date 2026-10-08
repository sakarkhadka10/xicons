import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

interface PublishPackage {
  readonly dir: string;
  readonly name: string;
  readonly required: readonly string[];
}

interface PackageJson {
  readonly name?: string;
  readonly version?: string;
  readonly private?: boolean;
  readonly license?: string;
  readonly files?: readonly string[];
  readonly exports?: {
    readonly "."?: {
      readonly import?: string;
      readonly types?: string;
    };
  };
}

const PUBLISH_PACKAGES: readonly PublishPackage[] = [
  {
    dir: "packages/core",
    name: "@axcore/xicons",
    required: ["dist/index.js", "dist/index.d.ts"],
  },
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
] as const;

const FORBIDDEN_PREFIXES = [
  "node_modules/",
  "src/",
  "test/",
  "coverage/",
  ".env",
] as const;

function readJson(path: string): PackageJson {
  return JSON.parse(readFileSync(path, "utf8")) as PackageJson;
}

function assertPackageMetadata(dir: string, expectedName: string): void {
  const pkg = readJson(join(dir, "package.json"));
  if (pkg.private) {
    throw new Error(`${expectedName}: must not be private`);
  }
  if (pkg.name !== expectedName) {
    throw new Error(`${dir}: expected name ${expectedName}, got ${pkg.name ?? "(missing)"}`);
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

function listTarPaths(tgzPath: string): string[] {
  const out = execFileSync("tar", ["-tzf", tgzPath], { encoding: "utf8" });
  return out.split("\n").filter(Boolean);
}

const versions = new Set<string>();

for (const pkg of PUBLISH_PACKAGES) {
  assertPackageMetadata(pkg.dir, pkg.name);
  const meta = readJson(join(pkg.dir, "package.json"));
  if (meta.version) {
    versions.add(meta.version);
  }

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
      const found = paths.some(
        (p) => p.endsWith(`/${required}`) || p.endsWith(required),
      );
      if (!found) {
        throw new Error(`${pkg.name}: tarball missing ${required}`);
      }
    }
    for (const forbidden of FORBIDDEN_PREFIXES) {
      if (
        paths.some(
          (p) => p.includes(`/${forbidden}`) || p.startsWith(`package/${forbidden}`),
        )
      ) {
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

const version = [...versions][0];
console.log(`Pack verification passed for ${PUBLISH_PACKAGES.length} packages (v${version}).`);
