import { existsSync, mkdirSync } from 'fs';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron';
import { DocumentTarget } from './documentTarget';
import { prod } from '_/utils/node-env';

/**
 * Returns the directory to which the exported files are saved to
 */
const getAppDataDirectory = () => (prod ? app.getPath('userData') : __dirname);

/**
 * Creates the directory if it doesn't exist
 * @param directory Directory that should exist
 * @returns Directory that should exist
 */
const ensureExisting = (directory: string) => {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
  return directory;
};

/**
 * Object containing all app directories
 */
export const directories = {
  appData: getAppDataDirectory,
  assets: () => (prod ? path.join(__dirname, '../assets') : 'src/assets'),
  documents: (target: DocumentTarget) => {
    const type = target.type;
    let targetDir: string;
    switch (type) {
      case 'resident':
        targetDir = `residents/${target.residentId}`;
        break;
      case 'incidentals':
        targetDir = `incidentals/${target.incidentalsId}`;
        break;
      default:
        const typeNever: never = type;
        throw new Error(`Missing case for target type ${typeNever}`);
    }
    return ensureExisting(
      path.join(getAppDataDirectory(), 'documents', targetDir),
    );
  },
  temporary: () => ensureExisting(path.join(getAppDataDirectory(), 'tmp')),
} as const;

export default getAppDataDirectory;
