import { SchematicContext, Tree } from "@angular-devkit/schematics";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { updateJSONPropertyOf } from "../json";
import { PACKAGE_JSON } from "./constants";
import { PackageJsonOptions } from "./models";

export function addPackageJsonDependency(
  type: string,
  pkg: string,
  version: string
) {
  return updateJSONPropertyOf(PACKAGE_JSON, `${type}.${pkg}`, version);
}

export function addScript(scriptName: string, scriptCommand: string) {
  return updateJSONPropertyOf(
    PACKAGE_JSON,
    `scripts.${scriptName}`,
    scriptCommand
  );
}

export function installDependencies(options: PackageJsonOptions) {
  return (tree: Tree, context: SchematicContext) => {
    if (!options.skipInstall) {
      context.addTask(new NodePackageInstallTask());
    }
    return tree;
  };
}
