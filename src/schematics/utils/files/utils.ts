import { Rule, Tree } from "@angular-devkit/schematics";

export function removeFile(path: string): Rule {
  return (tree: Tree) => {
    tree.delete(path);
    return tree;
  };
}
