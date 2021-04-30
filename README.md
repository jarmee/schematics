# @jarmee/schematics

This package provides several schematics to make the life of an Angular developer easier. If applied it will provide you the following benefits:

- _adds Jest support to your Angular workspace_

## Usage

To apply this package to an already existing Angular workspace you only have to execute `ng add @jarmee/schematics` and you're good to go. During the installation process of the schematics it will carry out the steps stated below:

1. The schematics will add `test:jest` and `test:jest:watch` scripts to your `package.json` to run `jest`. Followed by the addition of `jest`, `jest-preset-angular` and `@types/jest` to the `devDependecies` of your `package.json`. To complete this step a `npm install` is executed.
2. It will update the `tsconfig.spec.json` in your root directory and adds `jest` to the `types` array of your `compilerOptions`. Also the porperty `esModuleInterop` will be added and set to `true`.
3. To prevent inconveniences the schematic will remove the `src/test.ts` file from your workspace.
4. Finally it will add the files `jest.config.js`, `jestGlobalMocks.ts` and `setup-jest.ts` to the root of your Angular workspace.

## License

This project is licensed under the MIT License
