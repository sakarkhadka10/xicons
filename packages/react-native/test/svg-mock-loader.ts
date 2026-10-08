interface ResolveResult {
  readonly url: string;
  readonly shortCircuit?: boolean;
}

type NextResolve = (
  specifier: string,
  context: Record<string, unknown>,
) => Promise<ResolveResult>;

export async function resolve(
  specifier: string,
  context: Record<string, unknown>,
  nextResolve: NextResolve,
): Promise<ResolveResult> {
  if (specifier === "react-native-svg") {
    return {
      shortCircuit: true,
      url: new URL("./react-native-svg-mock.ts", import.meta.url).href,
    };
  }

  return nextResolve(specifier, context);
}
