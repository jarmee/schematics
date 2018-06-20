import { Rule, mergeWith, apply, url, Tree, SchematicContext, chain, MergeStrategy } from '@angular-devkit/schematics';
import {
  NodePackageInstallTask
} from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, addPropertyToPackageJson, addScriptToPackageJson } from '../utils/package';
import { jestVersion, jestAngularPreset } from '../add-jest-support/supportedVersions';

export interface AngularJestOptions {
  skipInstall: boolean;
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function addJestSupport(options: AngularJestOptions): Rule {
  debugger;
  return chain([
    addJestConfig(options),
    addJestScripts(options),
    addDependendencies(options),
    installDependencies(options),
    mergeWith(apply(url('./files'), []),  MergeStrategy.Overwrite),
  ]);
}

function addJestConfig(_options: AngularJestOptions): Rule {
  return (tree: Tree) => {
    addPropertyToPackageJson(tree, 'jest', {
      preset: "jest-preset-angular",
      setupTestFrameworkScriptFile: "<rootDir>/src/setupJest.ts"
    });
  };
}

function addJestScripts(_options: AngularJestOptions): Rule {
  return (tree: Tree) => {
    addScriptToPackageJson(tree, 'test:jest', 'jest');
    addScriptToPackageJson(tree, 'test:jest:watch', 'jest --watch');
  };
}

function addDependendencies(_otpions: AngularJestOptions) {
  return (tree: Tree) => {
    addPackageJsonDependency(tree, 'devDependencies', 'jest', jestVersion);
    addPackageJsonDependency(tree, 'devDependencies', 'jest-preset-angular', jestAngularPreset);
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
