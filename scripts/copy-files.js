const { argv } = require("process");
const {
  existsSync,
  readdirSync,
  lstatSync,
  mkdirSync,
  copyFileSync,
} = require("fs");

function __isDirectory(path) {
  if (!path) return false;
  return lstatSync(path).isDirectory();
}

function __copyNoneTypescriptFiles(sourceDirectoryPath, targetDirectoryPath) {
  if (!sourceDirectoryPath) throw Error("No source directory provided");
  if (!targetDirectoryPath) throw Error("No target directory provided");
  if (!existsSync(sourceDirectoryPath))
    throw Error(
      `The source path you provided points to a non existing directory. (${sourceDirectoryPath})`
    );
  if (!__isDirectory(sourceDirectoryPath))
    throw Error(
      `The source path you provided points not to a directory. (${sourceDirectoryPath})`
    );

  if (!existsSync(targetDirectoryPath)) {
    mkdirSync(targetDirectoryPath);
  }

  if (!__isDirectory(targetDirectoryPath))
    throw Error(
      `The target path you provided points not to a directory. (${targetDirectoryPath})`
    );

  readdirSync(sourceDirectoryPath).forEach((pathSegment) => {
    if (__isDirectory(`${sourceDirectoryPath}/${pathSegment}`)) {
      if (!existsSync(`${targetDirectoryPath}/${pathSegment}`)) {
        mkdirSync(`${targetDirectoryPath}/${pathSegment}`);
      }
      __copyNoneTypescriptFiles(
        `${sourceDirectoryPath}/${pathSegment}`,
        `${targetDirectoryPath}/${pathSegment}`
      );
    } else {
      copyFileSync(
        `${sourceDirectoryPath}/${pathSegment}`,
        `${targetDirectoryPath}/${pathSegment}`
      );
    }
  });
}

try {
  __copyNoneTypescriptFiles(argv[2], argv[3]);
} catch (e) {
  console.error(e);
}
