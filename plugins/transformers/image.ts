import { Plugin, PluginTest } from "../plugin.ts";

import { path, ts } from "../../deps.ts";
import type { Graph } from "../../graph.ts";

interface Config {
  test?: PluginTest;
}

const printer: ts.Printer = ts.createPrinter({ removeComments: false });

function getImageDataType(input: string) {
  if (/png$/i.test(input)) return "image/png";
  if (/jpe?g$/i.test(input)) return "image/jpeg";
  if (/tiff$/i.test(input)) return "image/tiff";
  if (/svg$/i.test(input)) return "image/svg+xml";

  throw Error(`The image type ${path.extname(input)} is not supported.`);
}

export function image(
  {
    test = (input: string) => /\.(png|jpe?g|tiff|svg)$/i.test(input),
  }: Config = {},
) {
  const fn = async (
    input: string,
    source: string,
    { graph }: { graph: Graph },
  ) => {
    const array = await Deno.readFile(input);
    const base64 = btoa(
      array.reduce((data, byte) => data + String.fromCharCode(byte), ""),
    );

    const entry = graph[input];
    entry.exports[input] = entry.exports[input] || { specifiers: [] };
    entry.exports[input].specifiers.push("default");

    const ast = [
      ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList(
          [ts.createVariableDeclaration(
            ts.createIdentifier("url"),
            undefined,
            ts.createStringLiteral(
              `data:${getImageDataType(input)};base64,${base64}`,
            ),
          )],
          ts.NodeFlags.Const,
        ),
      ),
      ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList(
          [ts.createVariableDeclaration(
            ts.createIdentifier("image"),
            undefined,
            ts.createNew(
              ts.createIdentifier("Image"),
              undefined,
              [],
            ),
          )],
          ts.NodeFlags.Const,
        ),
      ),
      ts.createExpressionStatement(ts.createBinary(
        ts.createPropertyAccess(
          ts.createIdentifier("image"),
          ts.createIdentifier("src"),
        ),
        ts.createToken(ts.SyntaxKind.EqualsToken),
        ts.createIdentifier("url"),
      )),
      ts.createExportAssignment(
        undefined,
        undefined,
        undefined,
        ts.createIdentifier("image"),
      ),
    ];

    const string = printer.printList(
      ts.EmitHint.SourceFile,
      ts.createNodeArray(ast),
      source,
    );
    return string;
  };

  return new Plugin({
    test,
    fn,
  });
}
