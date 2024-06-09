// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import ipcCommands from './ipcCommands';
import { ContractGenerationArgs } from './utils/contractGeneration';
import { DocumentTarget } from './utils/persistence/documentTarget';
import Invoice from '_/models/invoice/invoice';

const ipcAPI = {
  /**
   * Notify main the renderer is ready
   */
  rendererReady: () => ipcRenderer.send(ipcCommands.rendererReady),

  /**
   * Converts the given object to json and writes it to the specified file
   * @param toExport object that should be exported
   * @param filename file to which the object is saved
   */
  exportObject: <T>(toExport: T, filename: string): Promise<void> => ipcRenderer.invoke(
    ipcCommands.exportObject,
    toExport,
    filename,
  ) as Promise<void>,

  /**
   * Imports the specified json file and parses it to an object of type T
   * @param filename file that should be imported
   * @returns `null` if the import failed, otherwise the imported object
   */
  importObject: <T>(filename: string) => ipcRenderer.invoke(ipcCommands.importObject, filename) as Promise<T | null>,

  /**
   * Generates the pdf files for the provided invoice
   * @param invoice Invoice for which the pdfs should be created
   */
  generateInvoicePdfs: (invoice: Invoice) => ipcRenderer.invoke(
    ipcCommands.generateInvoicePdfs,
    invoice,
  ) as Promise<void>,

  /**
   * Generates the contract as pdf file
   */
  generateContractPdf: (args: ContractGenerationArgs) => ipcRenderer.invoke(ipcCommands.generateContractPdf, args) as Promise<void>,

  /**
   * Opens a file dialog to select a single file
   * @returns Selected file path or `undefined` if no file was selected
   */
  selectFile: () => ipcRenderer.invoke(ipcCommands.selectFile) as Promise<string | undefined>,

  /**
   * Copies the selected file to the documents
   * @param uploadedFile File that should be copied to the documents
   * @param fileName Filename the copied document should have
   * @param target Target to which the document is linked to
   */
  uploadDocument: (
    uploadedFile: string,
    fileName: string,
    target: DocumentTarget,
  ) => ipcRenderer.invoke(
    ipcCommands.uploadDocument,
    uploadedFile,
    fileName,
    target,
  ) as Promise<void>,
};

export default ipcAPI;
