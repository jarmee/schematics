import { JsonObject } from "@angular-devkit/core";
import { EmptyTree, Tree } from "@angular-devkit/schematics";
import { UnitTestTree } from "@angular-devkit/schematics/testing";
import { ENCODING } from "./constants";
import { JSONContext } from "./models";
import { updateJSONPropertyOf } from "./utils";

function _toJSON(tree: Tree, path: string): JsonObject {
  const jsonText = tree.get(path)?.content.toString(ENCODING)!;
  return JSON.parse(jsonText);
}

describe("JSON Utils", () => {
  const tsConfigSpecPath = "/tsconfig.spec.json";
  let context: JSONContext;
  let tree: Tree;
  beforeEach(() => {
    tree = new UnitTestTree(new EmptyTree());
    tree.create(
      tsConfigSpecPath,
      `{
        "compilerOptions": {
          "types": ["node", "lodash-es"]
        }
      }`
    );
    context = {} as any;
  });

  describe("updateJSONPropertyOf", () => {
    it("should update the property defined through the given path", () => {
      const actual = updateJSONPropertyOf(
        tsConfigSpecPath,
        "test",
        true
      )(tree, context);
      expect(actual).not.toBeFalsy();
      expect(_toJSON(actual, tsConfigSpecPath)["test"]).toBe(true);
    });

    it("should append the value to the array property", () => {
      const actual = updateJSONPropertyOf(
        tsConfigSpecPath,
        "compilerOptions.types",
        ["jest"]
      )(tree, context);
      expect(actual).not.toBeFalsy();
      expect(
        (_toJSON(actual, tsConfigSpecPath) as any).compilerOptions.types
      ).toStrictEqual(["node", "lodash-es", "jest"]);
    });
  });
});
