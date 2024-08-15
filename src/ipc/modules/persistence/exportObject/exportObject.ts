import fs from 'fs';
import path from 'path';
import getAppDataDirectory from '_/ipc/utils/persistence/getAppDataDirectory';

/**
 * Converts the given object to json and writes it to the specified file
 * @param toExport object that should be exported
 * @param filename file to which the object is saved
 */
export function exportObject<T>(toExport: T, filename: string): void {
  const outputPath = path.join(getAppDataDirectory(), filename);
  const json = JSON.stringify(toExport, null, 4);
  fs.writeFileSync(outputPath, json);
}
