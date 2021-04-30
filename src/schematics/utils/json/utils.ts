import { JsonArray, JsonObject, JsonValue } from "@angular-devkit/core";
import { Tree } from "@angular-devkit/schematics";
import { flow, isArray } from "lodash";
import { ENCODING, JSON_VALUE_PATH_DELIMITER } from "./constants";
import { InvalidJSONValuePathError } from "./errors";
import {
  JSONContext,
  JSONFuncArgs,
  JSONValuePath as JsonValuePath,
} from "./models";

function __toJSONValuePath(jsonValuePath: string): JsonValuePath {
  if (!jsonValuePath) throw new InvalidJSONValuePathError();
  return jsonValuePath.split(JSON_VALUE_PATH_DELIMITER);
}

function __getJSON(path: string): (args: JSONFuncArgs) => [Tree, JSONContext] {
  return ([tree, context]) => {
    if (tree.exists(path)) {
      const sourceText = tree.read(path)!.toString(ENCODING);
      context.object = JSON.parse(sourceText);
    }
    return [tree, context];
  };
}

function _upsertArrayProperty(
  array: JsonArray,
  propertyValue: JsonArray
): JsonArray {
  if (!array || array.length === 0) return [propertyValue];
  return [...array, ...propertyValue];
}

function __isLast(path: JsonValuePath) {
  return path && path.length === 1;
}

function __setValue(
  jsonObject: JsonObject,
  path: JsonValuePath,
  value: JsonValue
): JsonObject {
  if (!jsonObject || !path) return jsonObject;
  const propertyName = path[0];
  if (__isLast(path)) {
    jsonObject[propertyName] = isArray(jsonObject[propertyName])
      ? _upsertArrayProperty(
          jsonObject[propertyName] as JsonArray,
          value as JsonArray
        )
      : value;
    return jsonObject;
  } else {
    if (!jsonObject[propertyName]) {
      jsonObject[propertyName] = {};
    }
    path.shift();
    jsonObject[propertyName] = __setValue(
      jsonObject[propertyName] as JsonObject,
      path,
      value
    );
    return jsonObject;
  }
}

function __setPropertyValue(
  propertyValuePath: JsonValuePath,
  propertyValue: JsonValue
): (args: JSONFuncArgs) => [Tree, JSONContext] {
  return ([tree, context]) => {
    context.object = __setValue(
      context.object,
      propertyValuePath,
      propertyValue
    );
    return [tree, context];
  };
}

function __updateJSON(
  path: string
): (args: JSONFuncArgs) => [Tree, JSONContext] {
  return ([tree, context]) => {
    tree.overwrite(path, JSON.stringify(context.object));
    return [tree, context];
  };
}

export function updateJSONPropertyOf(
  path: string,
  propertyValuePath: string,
  propertyValue: JsonValue
): (tree: Tree, context: JSONContext) => Tree {
  return (tree, context) => {
    [tree] = flow(
      __getJSON(path),
      __setPropertyValue(__toJSONValuePath(propertyValuePath), propertyValue),
      __updateJSON(path)
    )([tree, context]);
    return tree;
  };
}
