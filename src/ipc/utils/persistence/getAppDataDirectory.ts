import { existsSync, mkdirSync } from 'fs';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron';
import { prod } from '_/utils/node-env';

/**
 * Returns the directory to which the exported files are saved to
 */
/* istanbul ignore next */
const getAppDataDirectory = () => (prod ? app.getPath('userData') : __dirname);

/**
 * Returns a directory that can be used to store temporary app data
 */
export const getTmpDirectory = () => {
  const dir = path.join(getAppDataDirectory(), 'tmp');
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  return dir;
};

export default getAppDataDirectory;
