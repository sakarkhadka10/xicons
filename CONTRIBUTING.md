# Contributing to XIcons

Thank you for contributing to **XIcons**! ❤️

XIcons is an open-source icon ecosystem designed to provide consistent, developer-friendly icons across web, React, React Native, and CDN environments.

We welcome:

- New icons
- Icon metadata improvements
- Bug fixes
- Validator improvements
- Documentation improvements
- Developer experience improvements
- Tests and tooling improvements

The most important rule is simple:

> **Every change goes through a Pull Request.**

The `main` branch is protected. Contributors should never push directly to `main`.

---

## Table of Contents

- [Before You Start](#before-you-start)
- [Development Setup](#development-setup)
- [Fork the Repository](#fork-the-repository)
- [Repository Structure](#repository-structure)
- [Adding an Icon](#adding-an-icon)
- [Icon Directory Structure](#icon-directory-structure)
- [SVG Requirements](#svg-requirements)
- [Metadata Requirements](#metadata-requirements)
- [Icon Naming](#icon-naming)
- [Aliases](#aliases)
- [Categories](#categories)
- [Licensing and Brand Assets](#licensing-and-brand-assets)
- [Generating the Icon Registry](#generating-the-icon-registry)
- [Validation](#validation)
- [Building the Project](#building-the-project)
- [Creating a Branch](#creating-a-branch)
- [Keeping Your Branch Updated](#keeping-your-branch-updated)
- [Commit Messages](#commit-messages)
- [Opening a Pull Request](#opening-a-pull-request)
- [Pull Request Checklist](#pull-request-checklist)
- [Review Process](#review-process)
- [What CI Checks](#what-ci-checks)
- [Maintainer Review](#maintainer-review)
- [After Merge](#after-merge)
- [Release Process](#release-process)
- [Adding Multiple Icons](#adding-multiple-icons)
- [Improving XIcons](#improving-xicons)
- [Reporting Problems](#reporting-problems)
- [Requesting an Icon](#requesting-an-icon)
- [Code of Conduct](#code-of-conduct)
- [Questions](#questions)

---

# Before You Start

Before adding an icon, please check whether the icon already exists.

Search the repository first:

```bash
find icons -maxdepth 2 -type f
```

You can also search by name:

```bash
find icons -iname "*github*"
```

Please avoid submitting duplicate icons unless there is a clear reason for another variant.

---

# Development Setup

## Requirements

Make sure you have:

- Node.js 22+
- pnpm 12.10.1 (the version in the root `packageManager` field)
- Git

Check your versions:

```bash
node --version
pnpm --version
git --version
```

---

# Fork the Repository

If you are not a maintainer, start by creating a **fork** of the XIcons repository on GitHub.

You should not push directly to the official XIcons repository.

After creating your fork, clone **your fork**:

```bash
git clone https://github.com/YOUR_USERNAME/xicons.git
cd xicons
```

Replace `YOUR_USERNAME` with your GitHub username.

For example:

```bash
git clone https://github.com/johndoe/xicons.git
cd xicons
```

Install dependencies:

```bash
pnpm install
```

---

## Add the Upstream Repository

Add the official XIcons repository as `upstream`:

```bash
git remote add upstream https://github.com/sakarkhadka10/xicons.git
```

Check your remotes:

```bash
git remote -v
```

You should have something similar to:

```text
origin    https://github.com/YOUR_USERNAME/xicons.git
upstream  https://github.com/sakarkhadka10/xicons.git
```

### What these mean

- `origin` → your fork
- `upstream` → official XIcons repository

You push your changes to:

```text
origin
```

You create Pull Requests against:

```text
upstream/main
```

---

# Repository Structure

The project is organized as a pnpm monorepo.

```text
xicons/
├── apps/
│   └── cdn/                 @axcore/xicons-cdn (private, not published)
├── icons/
│   ├── react/
│   │   ├── original.svg
│   │   ├── mono.svg
│   │   └── metadata.json
│   └── nextjs/
│       ├── original.svg
│       ├── mono.svg
│       └── metadata.json
├── packages/
│   ├── core/                @axcore/xicons
│   ├── react/               @axcore/xicons-react
│   └── react-native/        @axcore/xicons-react-native
├── tools/
│   └── icon-validator/      @axcore/xicons-icon-validator (private)
├── scripts/
├── docs/
├── .github/
├── CONTRIBUTING.md
├── README.md
├── package.json
└── pnpm-workspace.yaml
```

The `icons/` directory is the source of truth for icon assets.

---

# Adding an Icon

Each icon should have its own directory:

```text
icons/<icon-slug>/
```

For example:

```text
icons/github/
├── original.svg
├── mono.svg
└── metadata.json
```

---

# Icon Directory Structure

Every icon should contain:

```text
original.svg
mono.svg
metadata.json
```

## `original.svg`

This is the full-color or brand version of the icon.

Example:

```xml
<svg
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  ...
</svg>
```

Use the official colors where the asset is legally permitted for redistribution.

---

## `mono.svg`

This is the monochrome version.

It should use:

```text
currentColor
```

where the icon's color needs to inherit from the consuming application.

Example:

```xml
<svg
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path fill="currentColor" d="..." />
</svg>
```

Do not hard-code a single arbitrary color into the monochrome version.

---

# SVG Requirements

All SVG files should:

- Be valid SVG
- Include a valid `viewBox`
- Use clean SVG markup
- Avoid unnecessary metadata
- Avoid embedded raster images
- Avoid scripts
- Avoid external resources
- Avoid unnecessary editor-specific data
- Avoid unsafe SVG features
- Use paths/shapes that render consistently
- Preserve the intended visual appearance

Prefer:

```xml
viewBox="0 0 24 24"
```

or the appropriate official viewBox for the icon.

Do not arbitrarily resize or distort an icon simply to force a particular viewBox.

---

# Metadata Requirements

Each icon must have a `metadata.json`. Copy the shape of the existing icons. There is no `slug` field. The directory name is the canonical name.

```json
{
  "name": "react",
  "title": "React",
  "category": "framework",
  "website": "https://react.dev",
  "aliases": ["reactjs"]
}
```

| Field | Required | Rule |
| --- | --- | --- |
| `name` | yes | Exactly the directory name. Lowercase. This is the canonical id. |
| `title` | yes | Human-readable label, such as `React` or `Next.js`. |
| `category` | yes | One of the categories below. |
| `website` | no | Product site. |
| `aliases` | no | Other lookup strings. Not the canonical name, and not another icon's name or alias. |

`pnpm validate` rejects metadata that does not match this table. Look at `icons/react/metadata.json` before adding a new icon.

---

# Icon Naming

The directory name is the canonical icon slug.

Use:

```text
lowercase
```

and prefer:

```text
kebab-case
```

Examples:

```text
github
nextjs
google-drive
visual-studio-code
```

Avoid:

```text
GitHub
GitHubIcon
github_icon
githubIcon
```

The canonical slug should be:

- Predictable
- URL-friendly
- Filesystem-friendly
- Easy to type
- Unique

---

# Aliases

Aliases can be added when an icon is commonly known by multiple names.

For example:

```json
{
  "aliases": ["github", "git-hub"]
}
```

Do not add random or speculative aliases.

Aliases should represent meaningful alternative names developers are likely to search for.

---

# Categories

Icons use metadata categories.

Do not create a new directory solely because an icon belongs to a different category.

For example:

```text
icons/
├── github/
├── docker/
├── npm/
└── vercel/
```

Not:

```text
icons/
├── developer/
│   ├── github/
│   └── docker/
│
└── hosting/
    └── vercel/
```

Categories belong in metadata. The allowed values are:

```text
language, framework, library, runtime, database, cloud, devops,
tool, editor, design, mobile, ai, platform, other
```

That list is `iconCategories` in `packages/core/src/categories.ts`. Do not invent a category in an icon PR. Add it to that list first if a new one is actually needed.

---

# Licensing and Brand Assets

The XIcons code is MIT licensed. That license does not grant trademark rights, and it does not make someone else's logo MIT-licensed.

A technology mark is not redistributable just because a PNG or SVG is easy to find. Some brand guidelines allow redistribution with attribution. Some forbid modified artwork. A traced or redrawn logo is still the brand owner's artwork.

Before you add an icon:

1. Start from an official asset, or from a file whose license allows redistribution in this repository.
2. In the pull request, link the source file and the license or brand guideline you used.
3. Say whether the SVG is unchanged, and what you changed for `mono.svg`.
4. If the guideline is unclear, open an icon request. Do not upload the file.

Do not add a logo by redrawing it from memory or from a screenshot.

Maintainers reject icons when the source or the redistribution right is missing, even when CI passes.

XIcons does not grant trademark rights to any depicted brand. Names and logos stay with their owners.

---

# Generating the Icon Registry

The icon registry is generated from the source icons.

Do **not** manually edit:

```text
packages/core/src/icons.generated.ts
```

Regenerate the registry from the repository root:

```bash
pnpm --filter @axcore/xicons generate
```

That command rewrites `packages/core/src/icons.generated.ts`. `pnpm validate` regenerates the same file. Commit the result with your icon. CI rejects a pull request when this command would change the file:

```bash
git diff --exit-code -- packages/core/src/icons.generated.ts
```

---

# Validation

Before opening a Pull Request, run:

```bash
pnpm validate
```

From the repository root, this runs:

1. Icon validation (`@axcore/xicons-icon-validator`)
2. `pnpm typecheck`
3. `pnpm lint`
4. `pnpm test`

Icon validation checks the directory name, `metadata.json`, `original.svg`, optional `mono.svg`, alias conflicts, `viewBox`, and that mono artwork uses `currentColor`. It also rejects SVG scripts. `original.svg` is required. `mono.svg` may be omitted; renderers then use the original artwork.

All of these commands must pass before you open the pull request.

If validation fails, fix the problem before opening the Pull Request.

---

# Building the Project

You can also run the full build:

```bash
pnpm build
```

This ensures the packages can be built successfully.

You normally do not need to run npm publishing commands when contributing an icon.

---

# Creating a Branch

Never work directly on `main`.

First make sure your local `main` is up to date:

```bash
git checkout main
git fetch upstream
git pull upstream main
```

Then create a new branch:

```bash
git checkout -b feat/add-github-icon
```

Recommended branch prefixes:

```text
feat/
fix/
docs/
test/
refactor/
chore/
```

Examples:

```text
feat/add-github-icon
feat/add-docker-icon
fix/icon-validator
docs/improve-contributing
test/add-registry-tests
```

---

# Keeping Your Branch Updated

If your Pull Request stays open for a while and `main` has changed, update your branch before requesting final review.

First fetch the latest upstream changes:

```bash
git fetch upstream
```

Then update your branch:

```bash
git checkout main
git pull upstream main
git checkout feat/add-github-icon
git merge main
```

Resolve any conflicts if necessary.

Then run:

```bash
pnpm validate
pnpm build
```

Push the updated branch:

```bash
git push origin feat/add-github-icon
```

Your Pull Request will automatically update.

---

# Commit Messages

Use clear, descriptive commit messages.

Preferred format:

```text
type: description
```

Examples:

```text
feat: add GitHub icon
feat: add Docker icon
fix: improve SVG validation
docs: update contribution guide
test: add registry alias tests
chore: update dependencies
```

Keep commits focused.

Avoid messages such as:

```text
stuff
changes
update
fix
test
asdf
```

---

# Opening a Pull Request

After your changes are complete, review your changes:

```bash
git status
```

You can also inspect the changes:

```bash
git diff
```

Run the validation:

```bash
pnpm validate
```

Run the build:

```bash
pnpm build
```

Then commit your changes:

```bash
git add .
git commit -m "feat: add GitHub icon"
```

Push to **your fork**:

```bash
git push origin feat/add-github-icon
```

Then open a Pull Request on GitHub.

The Pull Request should target:

```text
sakarkhadka10/xicons
```

and:

```text
main
```

GitHub Actions will automatically run the project's CI checks.

---

# Pull Request Checklist

Before submitting a Pull Request, make sure:

- [ ] The icon does not already exist.
- [ ] The directory name matches `metadata.json` `name`.
- [ ] `original.svg` is included.
- [ ] `mono.svg` is included, or the pull request explains why this icon has no mono variant.
- [ ] `metadata.json` matches the schema above.
- [ ] SVG files have valid `viewBox` values.
- [ ] The monochrome icon uses `currentColor`.
- [ ] The SVG contains no unsafe or unnecessary content.
- [ ] Metadata is accurate.
- [ ] `website` is set when the product has a public site.
- [ ] The pull request links the SVG source and the license or brand guideline.
- [ ] The generated registry is synchronized.
- [ ] `pnpm validate` passes.
- [ ] `pnpm build` passes.
- [ ] The Pull Request contains a clear description.

---

# Review Process

XIcons uses a maintainer-reviewed contribution model.

The `main` branch is protected.

Contributors cannot directly push changes to `main`.

Every contribution goes through:

```text
Contributor
     ↓
Fork
     ↓
Feature branch
     ↓
Pull Request
     ↓
Automated CI
     ↓
Maintainer review
     ↓
Approval
     ↓
All conversations resolved
     ↓
Squash merge
     ↓
main
```

The maintainer may request changes before merging.

If changes are requested:

1. Update your branch.
2. Push the new commits.
3. CI will run again.
4. Address all review conversations.
5. Request another review when ready.

Do not open a second Pull Request for the same change unless specifically requested.

---

# What CI Checks

Pull Requests are automatically checked against the supported Node.js versions.

The required checks currently include:

```text
validate (22)
validate (24)
```

A Pull Request cannot be merged into `main` while required checks are failing.

The CI verifies things such as:

- Icon validation
- Generated registry consistency
- TypeScript
- Linting
- Tests
- Package builds
- Package contents

---

# Maintainer Review

The maintainer will review:

## Icon Quality

- Does the icon accurately represent the source?
- Is the SVG clean?
- Does the monochrome variant work correctly?
- Does it render correctly at different sizes?

## Metadata

- Does `name` match the directory?
- Is `title` the name a person would read?
- Are aliases useful, and do they avoid the canonical name?
- Is `category` one of the allowed values?
- Is `website` correct?

## Licensing

- Is the source trustworthy?
- Is redistribution appropriate?
- Are brand guidelines respected?

## Technical Quality

- Does validation pass?
- Does the generated registry remain synchronized?
- Does the icon work with the supported packages?

The maintainer may reject an icon even when CI passes if it does not meet the project's quality, licensing, or consistency standards.

---

# After Merge

Once a Pull Request is approved and merged:

```text
main
```

contains the new icon.

The icon becomes part of the next release.

Merging a Pull Request does **not** automatically publish a new npm version.

Release versions are managed separately by the maintainer.

Contributors do not need npm publishing access.

---

# Release Process

XIcons uses automated npm publishing through GitHub Actions and npm Trusted Publishing.

Contributors should **not** run:

```bash
npm publish
```

for XIcons packages.

Releases are created by the maintainer.

The release process is:

```text
Changes merged into main
        ↓
Release version selected
        ↓
Package versions updated
        ↓
CI passes
        ↓
Version tag created
        ↓
GitHub Actions
        ↓
npm Trusted Publishing
        ↓
npm packages published
```

The publishable packages are:

```text
@axcore/xicons
@axcore/xicons-react
@axcore/xicons-react-native
```

They are released in lockstep.

---

# Adding Multiple Icons

If you are contributing multiple icons, you may submit them together when they form a coherent contribution.

For example:

```text
feat: add popular developer platform icons
```

with:

```text
icons/
├── docker/
├── github/
├── gitlab/
└── kubernetes/
```

However, very large contributions may be split into multiple Pull Requests if that makes review easier.

When in doubt, prefer smaller, focused Pull Requests.

---

# Improving XIcons

You do not have to contribute icons only.

You can also contribute:

- Tests
- Documentation
- Validators
- Generators
- React components
- React Native components
- CDN functionality
- Developer tooling
- CI improvements
- Bug fixes
- Performance improvements

For significant architectural changes, please open an issue first so the approach can be discussed before implementation.

---

# Reporting Problems

If you find a bug or problem, open a GitHub issue.

Include:

- What happened
- What you expected
- Steps to reproduce
- Relevant package/version
- Node.js version
- pnpm version
- Error output where applicable

Screenshots or minimal reproduction examples are helpful.

Please search existing issues before opening a new one.

---

# Requesting an Icon

If you cannot contribute the icon yourself, open an icon request issue instead.

Include:

- Icon/brand name
- Official website
- Why the icon would be useful
- Any relevant official asset/brand guideline link

Please search existing issues first to avoid duplicate requests.

---

# Code of Conduct

Be respectful and constructive.

XIcons is an open-source project and contributors may have different levels of experience.

Good contributions include:

- Clear communication
- Respectful reviews
- Helpful feedback
- Reproducible bug reports
- Clean Pull Requests

Harassment, discrimination, personal attacks, or intentionally disruptive behavior are not acceptable.

---

# Questions

If you are unsure about something:

1. Search the existing documentation.
2. Search existing issues and Pull Requests.
3. Open an issue for discussion.

For larger changes, discussing the approach before writing a large Pull Request is encouraged.

---

## Thank You ❤️

Every contribution helps make XIcons better for developers everywhere.

Whether you add one icon, improve documentation, fix a bug, or improve the tooling — thank you for helping build XIcons.

**Happy contributing!**
