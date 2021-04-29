import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  Rule,
  SchematicContext,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import {
  jestPresetAngularVersion,
  jestVersion,
  typesJestVersion,
} from "../add-jest-support/supportedVersions";
import {
  addPackageJsonDependency,
  addPropertyToTsConfigSpecCompilerOptions,
  addScriptToPackageJson,
  addTypeToTsConfigSpecCompilerOptions,
} from "../utils/package";

export interface AngularJestOptions {
  skipInstall: boolean;
}

export function addJestSupport(options: AngularJestOptions): Rule {
  return chain([
    addJestScripts(options),
    addDependendencies(options),
    installDependencies(options),
    updateTsConfigSpec(options),
    removeTestTs(options),
    mergeWith(apply(url("./files"), []), MergeStrategy.Overwrite),
  ]);
}

function addJestScripts(_options: AngularJestOptions): Rule {
  return (tree: Tree) => {
    addScriptToPackageJson(tree, "test:jest", "jest");
    addScriptToPackageJson(tree, "test:jest:watch", "jest --watch");
  };
}

function addDependendencies(_otpions: AngularJestOptions) {
  return (tree: Tree) => {
    addPackageJsonDependency(tree, "devDependencies", "jest", jestVersion);
    addPackageJsonDependency(
      tree,
      "devDependencies",
      "jest-preset-angular",
      jestPresetAngularVersion
    );
    addPackageJsonDependency(
      tree,
      "devDependencies",
      "@types/jest",
      typesJestVersion
    );
  };
}

function updateTsConfigSpec(_options: AngularJestOptions): Rule {
  return (tree: Tree) => {
    addPropertyToTsConfigSpecCompilerOptions(tree, "esModuleInterop", true);
    addTypeToTsConfigSpecCompilerOptions(tree, "jest");
  };
}

function removeTestTs(_options: AngularJestOptions): Rule {
  return (tree: Tree) => {
    tree.delete("src/test.ts");
  };
}

function installDependencies(options: AngularJestOptions) {
  return (tree: Tree, context: SchematicContext) => {
    if (!options.skipInstall) {
      context.addTask(new NodePackageInstallTask());
    }
    return tree;
  };
}
