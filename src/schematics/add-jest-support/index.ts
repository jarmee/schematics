import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  Rule,
  url,
} from "@angular-devkit/schematics";
import {
  jestPresetAngularVersion,
  jestVersion,
  typesJestVersion,
} from "../add-jest-support/supportedVersions";
import { removeFile } from "../utils/files";
import { updateJSONPropertyOf } from "../utils/json";
import {
  addPackageJsonDependency,
  installDependencies,
  PackageJsonOptions,
} from "../utils/package-json";
import { addScript } from "../utils/package-json/utils";
import { TSCONFIG_SPEC_PATH } from "./constants";

export interface AngularJestOptions extends PackageJsonOptions {}

export function addJestSupport(options: AngularJestOptions): Rule {
  return chain([
    mergeWith(apply(url("./files"), []), MergeStrategy.Overwrite),
    updateJSONPropertyOf(
      TSCONFIG_SPEC_PATH,
      "compilerOptions.esModuleInterop",
      true
    ),
    updateJSONPropertyOf(TSCONFIG_SPEC_PATH, "compilerOptions.types", "jest"),
    removeFile("src/test.ts"),
    addPackageJsonDependency("devDependencies", "jest", jestVersion),
    addPackageJsonDependency(
      "devDependencies",
      "jest-preset-angular",
      jestPresetAngularVersion
    ),
    addPackageJsonDependency(
      "devDependencies",
      "@types/jest",
      typesJestVersion
    ),
    addScript("test:jest", "jest"),
    addScript("test:jest:watch", "jest --watch"),
    installDependencies(options),
  ]);
}
