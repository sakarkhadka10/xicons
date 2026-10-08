# Release & CI/CD

This document is for maintainers. Contributors only need [CONTRIBUTING.md](../CONTRIBUTING.md) and `pnpm validate`.

## Local checks (same as CI)

```bash
pnpm install --frozen-lockfile
pnpm validate
git diff --exit-code -- packages/core/src/icons.generated.ts
pnpm build
pnpm pack:verify
pnpm publish:dry-run
```

Husky runs `pnpm validate` on every commit (`.husky/pre-commit`).

## Continuous integration

| Workflow | File | Triggers |
| --- | --- | --- |
| **CI** | `.github/workflows/ci.yml` | Pull requests and pushes to `main` |
| **Release** | `.github/workflows/release.yml` | Version tags `v*.*.*`, manual dispatch |

### CI job: `validate`

- Node.js **22** and **24** (matrix)
- pnpm **12.10.1** (from root `packageManager`)
- `pnpm validate` → icon validator, typecheck, lint, test
- Ensures `packages/core/src/icons.generated.ts` matches `icons/` sources
- `pnpm build`
- `pnpm pack:verify` (tarball contents for publishable packages)

Pull request workflows use `permissions: contents: read` only.

## Releasing to npm

### Versioning

All public packages share one version:

- `@axcore/xicons`
- `@axcore/xicons-react`
- `@axcore/xicons-react-native`

Bump `version` in each public package.json so the three versions stay identical, commit, then tag. Private packages (`@axcore/xicons-cdn`, `@axcore/xicons-icon-validator`, and the root workspace) are not part of that lockstep.

```bash
git tag v0.1.1
git push origin v0.1.1
```

The public packages are currently `0.1.1`, so the matching tag is `v0.1.1`. The tag must equal the `version` field (`v0.1.1` → `"0.1.1"`). Pushing a `v*.*.*` tag runs the publish job. Push a tag only when you mean to release.

### What gets published

| Package | Published |
| --- | --- |
| `@axcore/xicons` | Yes |
| `@axcore/xicons-react` | Yes |
| `@axcore/xicons-react-native` | Yes |
| `@axcore/xicons-cdn` | No (`private`) |
| `@axcore/xicons-icon-validator` | No (`private`) |
| Root `xicons` workspace | No (`private`) |

### Release workflow

1. **validate-release** — same checks as CI plus tag/version alignment and `pnpm publish:dry-run`
2. **publish** — runs only on **tag push** (not on pull requests)

Publishing uses **npm Trusted Publishing (OIDC)**. Do not add `NPM_TOKEN` to GitHub secrets for this flow.

### Manual dry-run on GitHub

Actions → **Release** → **Run workflow** (default: dry-run only). This runs validation and `npm publish --dry-run` without uploading.

## npm Trusted Publishing (manual setup)

**Automated in repo:** workflow file, OIDC permissions, publish order, no long-lived tokens in YAML.

**You must configure on npmjs.com** (once per package or via org defaults):

1. Log in to [npm](https://www.npmjs.com/) as an `@axcore` org maintainer.
2. For each package (`@axcore/xicons`, `@axcore/xicons-react`, `@axcore/xicons-react-native`):
   - Package → **Settings** → **Trusted Publishers**
   - Provider: **GitHub Actions**
   - Repository: `sakarkhadka10/xicons`
   - Workflow filename: `release.yml`
   - Environment: (optional; leave empty unless you add a GitHub Environment)
3. Ensure publish uses **npm CLI ≥ 11.5.1** (release job installs `npm@11.6.2` globally).

Until trusted publishers are configured, the **publish** job will fail at authentication — dry-run and CI still work.

Do not store npm access tokens in the repository or in pull request workflows.

## Merge policy

`main` is protected. Changes land through this path:

1. Fork the repository and open a pull request into `main`.
2. Required CI checks pass: `validate (22)` and `validate (24)`.
3. A maintainer approves.
4. Review conversations are resolved.
5. The pull request is squash-merged.

Do not push directly to `main`.

The ruleset is configured on GitHub. It is not stored in this repository, and it should not be disabled to land a change. The settings that match this policy are:

- Require a pull request before merging
- Require at least one approval
- Require conversation resolution
- Require the CI status checks above
- Allow squash merge

Dependabot opens weekly update PRs for GitHub Actions and npm (see `.github/dependabot.yml`).
