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
