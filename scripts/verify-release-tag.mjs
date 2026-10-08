import { readFileSync } from "node:fs";
import { join } from "node:path";

const PACKAGES = ["packages/core", "packages/react", "packages/react-native"];

const ref = process.env.GITHUB_REF ?? "";
const tag = ref.startsWith("refs/tags/") ? ref.slice("refs/tags/".length) : "";

if (!tag) {
  console.error("verify-release-tag: GITHUB_REF is not a release tag.");
  process.exit(1);
}

if (!/^v\d+\.\d+\.\d+/.test(tag)) {
  console.error(`verify-release-tag: tag "${tag}" must match vMAJOR.MINOR.PATCH`);
  process.exit(1);
}

const expectedVersion = tag.replace(/^v/, "").split("-")[0];

const versions = PACKAGES.map((dir) => {
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  return { dir, version: pkg.version, name: pkg.name };
});

for (const { dir, version, name } of versions) {
  if (version !== expectedVersion) {
    console.error(
      `${name} (${dir}) version ${version} does not match tag ${tag} (expected ${expectedVersion})`,
    );
    process.exit(1);
  }
}

console.log(`Release tag ${tag} matches package versions (${expectedVersion}).`);
