import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain } from 'electron';
import ipcCommands from './ipcCommands';
import InvoicePdfGenerator from './utils/invoicePdf';
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
    const directory = openDirectoryDialog();

    if (!directory) {
      return;
    }

    Object.keys(invoice.residentInformation).forEach((residentId) => {
      const pdf = new InvoicePdfGenerator(invoice, residentId).generatePdf();
      exportJsPdf(pdf, path.join(directory, `invoice-${residentId}.pdf`));
    });
  });
}
