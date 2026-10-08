import { execFileSync } from "node:child_process";

const PACKAGES = [
  "packages/core",
  "packages/react",
  "packages/react-native",
] as const;

for (const dir of PACKAGES) {
  console.log(`\n--- dry-run: ${dir} ---`);
  execFileSync(
    "pnpm",
    ["publish", "--dry-run", "--access", "public", "--no-git-checks"],
    {
      cwd: dir,
      stdio: "inherit",
    },
  );
}

console.log("\nAll publish dry-runs completed (no packages uploaded).");
