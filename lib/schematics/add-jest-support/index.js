"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const package_1 = require("../utils/package");
const supportedVersions_1 = require("../add-jest-support/supportedVersions");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function addJestSupport(options) {
    return schematics_1.chain([
        addJestConfig(options),
        addJestScripts(options),
        addDependendencies(options),
        installDependencies(options),
        schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), []), schematics_1.MergeStrategy.Overwrite),
    ]);
}
exports.addJestSupport = addJestSupport;
function addJestConfig(_options) {
    return (tree) => {
        package_1.addPropertyToPackageJson(tree, 'jest', {
            preset: "jest-preset-angular",
            setupTestFrameworkScriptFile: "<rootDir>/src/setupJest.ts"
        });
    };
}
function addJestScripts(_options) {
    return (tree) => {
        package_1.addScriptToPackageJson(tree, 'test:jest', 'jest');
        package_1.addScriptToPackageJson(tree, 'test:jest:watch', 'jest --watch');
    };
}
function addDependendencies(_otpions) {
    return (tree) => {
        package_1.addPackageJsonDependency(tree, 'devDependencies', 'jest', supportedVersions_1.jestVersion);
        package_1.addPackageJsonDependency(tree, 'devDependencies', 'jest-preset-angular', supportedVersions_1.jestAngularPreset);
    };
}
function installDependencies(options) {
    return (tree, context) => {
        if (!options.skipInstall) {
            context.addTask(new tasks_1.NodePackageInstallTask());
        }
        return tree;
    };
}
//# sourceMappingURL=index.js.map