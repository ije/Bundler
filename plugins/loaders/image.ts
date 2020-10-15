import { Loader, LoaderTest } from "../loader.ts";

export function imageLoader(
  { test = (input: string) => /\.(png|jpe?g|tiff|ico)$/i.test(input) }: {
    test?: LoaderTest;
  } = {},
) {
  return new Loader({
    test,
    fn: async (
      input: string,
      source: string,
    ) => {
      return {
        imports: {},
        exports: {},
      };
    },
  });
}