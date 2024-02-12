import fs from 'fs';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { app, dialog } from 'electron';
import jsPDF from 'jspdf';
import mainWindow from '../../electron/windows';
import { prod } from '_/utils/node-env';

/**
 * Returns the directory to which the exported files are saved to
 */
/* istanbul ignore next */
const saveDirectory = () => (prod ? app.getPath('userData') : __dirname);

/**
 * Converts the given object to json and writes it to the specified file
 * @param toExport object that should be exported
 * @param filename file to which the object is saved
 */
export function exportObject<T>(toExport: T, filename: string): void {
  const outputPath = path.join(saveDirectory(), filename);
  const json = JSON.stringify(toExport, null, 4);
  fs.writeFileSync(outputPath, json);
}

/**
 * Imports the specified json file and parses it to an object of type T
 * @param filename file that should be imported
 * @returns `null` if the import failed, otherwise the imported object
 */
export function importObject<T>(filename: string): T | null {
  const inputPath = path.join(saveDirectory(), filename);
  if (!fs.existsSync(inputPath)) {
    return null;
  }
  const json = fs.readFileSync(inputPath).toString();
  return JSON.parse(json) as T;
}

/**
 * Exports a jsPDF object to a file
 * @param pdf jsPDF that should be exported
 * @param filePath file to which the pdf should be exported
 */
export function exportJsPdf(pdf: jsPDF, filePath: string): void {
  const buffer = Buffer.from(pdf.output('arraybuffer'));
  fs.writeFileSync(filePath, buffer);
}

/**
 * Opens a file dialog that lets the user pick a single directory
 * @returns path to the directory if the user picked on, otherwise undefined
 */
export function openDirectoryDialog(): string | undefined {
  return dialog
    .showOpenDialogSync(mainWindow, {
      properties: ['openDirectory'],
    })
    ?.at(0);
}

/**
 * Opens a file dialog that lets the user pick a single file
 * @returns path to the file if the user picked on, otherwise undefined
 */
export function openFileDialog(): string | undefined {
  return dialog
    .showOpenDialogSync(mainWindow, {
      properties: ['openFile'],
      filters: [
        {
          name: 'Pdf',
          extensions: ['pdf'],
        },
      ],
    })
    ?.at(0);
}
