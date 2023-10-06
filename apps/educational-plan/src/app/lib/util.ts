import fs from "fs";
import path from "path";


function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
}

export function safePath(...args: string[]): string {
  const resultedPath = path.join(...args);
  ensureDirectoryExists(resultedPath);
  return resultedPath;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function split(str: string, separators: string[]) {
  return str.split(new RegExp(separators.join('|'), 'g'));
}
