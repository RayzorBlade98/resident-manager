import fs from 'fs';
import path from 'path';
import { directories } from '../../../utils/persistence/directories';

/**
 * Converts the given object to json and writes it to the specified file
 * @param toExport object that should be exported
 * @param filename file to which the object is saved
 */
export function exportObject<T>(toExport: T, filename: string): void {
  const outputPath = path.join(directories.appData(), filename);
  const json = JSON.stringify(toExport, null, 4);
  fs.writeFileSync(outputPath, json);
}
