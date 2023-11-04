// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import ipcCommands from './ipcCommands';
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
};

export default ipcAPI;
