import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron';
import * as nodeEnv from '_utils/node-env';

/**
 * Main window of the application
 */
let mainWindow: Electron.BrowserWindow | undefined;

/**
 * Creates a new main window if it wasn't created yet
 */
export function createMainWindow() {
  if (mainWindow) {
    return;
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 1080,
    width: 1920,
    webPreferences: {
      devTools: nodeEnv.dev,
      preload: path.join(__dirname, './preload.bundle.js'),
      webSecurity: nodeEnv.prod,
      nodeIntegration: true,
      contextIsolation: true,
    },
    resizable: false,
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html').finally(() => {
    /* no action */
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = undefined;
  });
}

export default mainWindow as Electron.BrowserWindow;
