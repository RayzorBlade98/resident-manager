import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain } from 'electron';
import ipcCommands from './ipcCommands';
import createInvoicePdfs from './utils/invoicePdf';
import {
  exportJsPdf,
  exportObject,
  importObject,
  openDirectoryDialog,
} from './utils/persistence';
import Invoice from '_/models/invoice/invoice';

export default function addIpcHandlers(): void {
  ipcMain.on(ipcCommands.rendererReady, () => {
    console.log('Renderer is ready.');
  });

  ipcMain.handle(
    ipcCommands.exportObject,
    (_, toExport: object, filename: string) => {
      exportObject(toExport, filename);
    },
  );

  ipcMain.handle(ipcCommands.importObject, (_, filename: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return importObject(filename);
    } catch {
      return null;
    }
  });

  ipcMain.handle(ipcCommands.generateInvoicePdfs, (_, invoice: Invoice) => {
    const pdfs = createInvoicePdfs(invoice);
    const directory = openDirectoryDialog();

    if (!directory) {
      return;
    }

    Object.entries(pdfs).forEach(([residentId, pdf]) => {
      exportJsPdf(pdf, path.join(directory, `invoice-${residentId}.pdf`));
    });
  });
}
