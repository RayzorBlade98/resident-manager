// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain } from 'electron';
import ipcCommands from './ipcCommands';
import generateContract from './modules/documentGeneration/contractGeneration/generateContract';
import { ContractGenerationArgs } from './modules/documentGeneration/contractGeneration/generateContractMarkdown';
import { generateInvoicePdfs } from './modules/documentGeneration/invoiceGeneration/generateInvoicePdfs';
import { GenerateRentIncreasePdfArgs } from './modules/documentGeneration/rentIncrease/GenerateRentIncreasePdfArgs';
import { generateRentIncreasePdf } from './modules/documentGeneration/rentIncrease/generateRentIncreasePdf';
import { exportObject } from './modules/persistence/exportObject/exportObject';
import { importObject } from './modules/persistence/importObject/importObject';
import uploadDocument from './modules/persistence/uploadDocument/uploadDocument';
import { openDocumentWindow } from './modules/windows/openFileWindow/openFileWindow';
import { openFileDialog } from './utils/persistence';
import { DocumentTarget } from './utils/persistence/documentTarget';
import Invoice from '_/models/invoice/invoice';
import Imported from '_/types/Imported';

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

  ipcMain.handle(
    ipcCommands.generateInvoicePdfs,
    (_, invoice: Imported<Invoice>) => generateInvoicePdfs(invoice),
  );

  ipcMain.handle(
    ipcCommands.generateContractPdf,
    async (_, args: Imported<ContractGenerationArgs>) => generateContract(args),
  );

  ipcMain.handle(ipcCommands.selectFile, () => openFileDialog());

  ipcMain.handle(
    ipcCommands.uploadDocument,
    (_, uploadedFile: string, target: DocumentTarget) => uploadDocument(uploadedFile, target),
  );

  ipcMain.handle(
    ipcCommands.generateRentIncreasePdf,
    (_, args: Imported<GenerateRentIncreasePdfArgs>) => generateRentIncreasePdf(args),
  );

  ipcMain.handle(
    ipcCommands.openDocumentWindow,
    (_, documentId: string, target: DocumentTarget) => openDocumentWindow(documentId, target),
  );
}
