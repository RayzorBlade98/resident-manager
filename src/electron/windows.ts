import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron';
import * as nodeEnv from '_utils/node-env';

/**
 * Main window of the application
 */
let mainWindow: Electron.BrowserWindow | undefined;

/**
 * List of all other application windows
 */
let otherWindows: Electron.BrowserWindow[] = [];

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
  void mainWindow.loadFile('index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = undefined;
    otherWindows = [];
  });
}

/**
 * Creates a new window that displays a file
 * @param filePath Path to the file that should be displayed
 */
export function createFileWindow(filePath: string) {
  const window = new BrowserWindow({
    height: 1080,
    width: 1920,
    webPreferences: {
      devTools: nodeEnv.dev,
      webSecurity: nodeEnv.prod,
    },
    parent: mainWindow,
    autoHideMenuBar: true,
  });
  void window.loadFile(filePath);
  otherWindows.push(window);
}

export default mainWindow as Electron.BrowserWindow;
