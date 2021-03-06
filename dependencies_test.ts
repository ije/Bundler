import { assertEquals } from "./test_deps.ts";
import { resolve } from "./dependencies.ts";

Deno.test("dependencies resolve path", async () => {
  const importMap = {
    imports: {
      "directory/": "my/path/",
    },
  };
  const path = "directory/parent.ts";
  const specifier = "./child.ts";
  const resolvedInput = resolve(path, specifier, importMap);
  assertEquals(resolvedInput, "my/path/child.ts");
});

Deno.test("dependencies resolve url", async () => {
  const importMap = {
    imports: {
      "directory/":
        "https://raw.githubusercontent.com/timreichen/Bundler/master/",
    },
  };
  const path = "directory/parent.ts";
  const specifier = "./child.ts";
  const resolvedInput = resolve(path, specifier, importMap);
  assertEquals(
    resolvedInput,
    "https://raw.githubusercontent.com/timreichen/Bundler/master/child.ts",
  );
});
