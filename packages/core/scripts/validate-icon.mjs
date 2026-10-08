export function parseIconCategories(source) {
  const match = source.match(
    /export const iconCategories = \[([\s\S]*?)\] as const;/,
  );
  if (!match?.[1]) {
    throw new Error("iconCategories export not found in src/categories.ts");
  }

  const categories = [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
  if (!categories.length) {
    throw new Error("iconCategories is empty");
  }

  return categories;
}

export function assertIconMetadata(dirName, metadata, categories) {
  if (metadata === null || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new Error(`${dirName}/metadata.json: must be an object`);
  }

  if (typeof metadata.name !== "string" || metadata.name !== dirName) {
    throw new Error(
      `${dirName}/metadata.json: name must be "${dirName}" to match the directory`,
    );
  }

  if (typeof metadata.title !== "string" || metadata.title.trim() === "") {
    throw new Error(`${dirName}/metadata.json: title must be a non-empty string`);
  }

  if (typeof metadata.category !== "string" || !categories.includes(metadata.category)) {
    throw new Error(
      `${dirName}/metadata.json: category must be one of: ${categories.join(", ")}`,
    );
  }

  if (metadata.website !== undefined) {
    if (typeof metadata.website !== "string" || metadata.website.trim() === "") {
      throw new Error(`${dirName}/metadata.json: website must be a non-empty string`);
    }
  }

  if (metadata.aliases !== undefined) {
    if (!Array.isArray(metadata.aliases)) {
      throw new Error(`${dirName}/metadata.json: aliases must be an array of strings`);
    }

    for (const alias of metadata.aliases) {
      if (typeof alias !== "string" || alias.trim() === "") {
        throw new Error(`${dirName}/metadata.json: aliases must be non-empty strings`);
      }
    }
  }

  return {
    name: metadata.name,
    title: metadata.title,
    category: metadata.category,
    website: metadata.website,
    aliases: metadata.aliases ?? [],
  };
}

export function assertAliasAvailable(name, alias, names, aliases) {
  const key = String(alias).toLowerCase();
  if (key === name.toLowerCase()) {
    throw new Error(`${name}: alias "${alias}" duplicates the canonical name`);
  }
  if (names.has(key) || aliases.has(key)) {
    throw new Error(`${name}: alias "${alias}" conflicts with another icon`);
  }
  aliases.add(key);
}

export function assertCanonicalNameAvailable(name, names, aliases) {
  if (names.has(name)) {
    throw new Error(`Duplicate icon name: ${name}`);
  }
  if (aliases.has(name.toLowerCase())) {
    throw new Error(`${name}: canonical name conflicts with an existing alias`);
  }
  names.add(name);
}

export function assertSvg(relativePath, svg, options = {}) {
  if (!svg.startsWith("<svg")) {
    throw new Error(`${relativePath}: must start with <svg`);
  }
  if (!svg.includes("viewBox=")) {
    throw new Error(`${relativePath}: missing viewBox`);
  }
  if (/<script\b/i.test(svg) || /javascript:/i.test(svg)) {
    throw new Error(`${relativePath}: scripts are not allowed`);
  }
  if (options.requireCurrentColor && !svg.includes("currentColor")) {
    throw new Error(`${relativePath}: mono SVG must use currentColor`);
  }
}
