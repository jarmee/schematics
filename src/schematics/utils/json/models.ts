import { JsonObject } from "@angular-devkit/core";
import { SchematicContext, Tree } from "@angular-devkit/schematics";

export interface JSONContext extends SchematicContext {
  object: JsonObject;
}
export type JSONValuePath = string[];
export type JSONFuncArgs = [Tree, JSONContext];
