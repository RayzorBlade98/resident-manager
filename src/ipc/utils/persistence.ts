import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { dialog } from 'electron';
import jsPDF from 'jspdf';
import mainWindow from '../../electron/windows';

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

type FileFilter = 'pdf';

/**
 * Opens a file dialog that lets the user pick a single file
 * @returns path to the file if the user picked on, otherwise undefined
 */
export function openFileDialog(options?: {
  createFile?: boolean;
  fileFilters?: FileFilter[];
}): string | undefined {
  const fileFilters: Record<string, Electron.FileFilter> = {
    pdf: {
      name: 'Pdf',
      extensions: ['pdf'],
    },
  };

  return dialog
    .showOpenDialogSync(mainWindow, {
      properties: [
        'openFile',
        ...(options?.createFile ? (['promptToCreate'] as const) : []),
      ],
      filters: options?.fileFilters?.map((filter) => fileFilters[filter]),
    })
    ?.at(0);
}
