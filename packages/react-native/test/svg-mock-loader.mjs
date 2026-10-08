export async function resolve(specifier, context, nextResolve) {
  if (specifier === "react-native-svg") {
    return {
      shortCircuit: true,
      url: new URL("./react-native-svg-mock.js", import.meta.url).href,
    };
  }

  return nextResolve(specifier, context);
}
