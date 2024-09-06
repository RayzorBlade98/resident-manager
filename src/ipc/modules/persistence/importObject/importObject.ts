import fs from 'fs';
import path from 'path';
import getAppDataDirectory from '_/ipc/utils/persistence/getAppDataDirectory';

/**
 * Imports the specified json file and parses it to an object of type T
 * @param filename file that should be imported
 * @returns `null` if the import failed, otherwise the imported object
 */
export function importObject<T>(filename: string): T | null {
  const inputPath = path.join(getAppDataDirectory(), filename);
  if (!fs.existsSync(inputPath)) {
    return null;
  }
  const json = fs.readFileSync(inputPath).toString();
  return JSON.parse(json) as T;
}
