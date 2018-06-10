import { Rule } from '@angular-devkit/schematics';
export interface AngularJestOptions {
    skipInstall: boolean;
}
export declare function addJestSupport(options: AngularJestOptions): Rule;
