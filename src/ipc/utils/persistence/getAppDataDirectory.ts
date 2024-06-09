// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron';
import { prod } from '_/utils/node-env';

/**
 * Returns the directory to which the exported files are saved to
 */
/* istanbul ignore next */
const getAppDataDirectory = () => (prod ? app.getPath('userData') : __dirname);

export default getAppDataDirectory;
