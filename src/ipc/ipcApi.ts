// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import ipcCommands from './ipcCommands';
import { ContractGenerationArgs } from './modules/documentGeneration/contractGeneration/generateContractMarkdown';
import { GenerateRentIncreasePdfArgs } from './modules/documentGeneration/rentIncrease/GenerateRentIncreasePdfArgs';
import { DocumentTarget } from './utils/persistence/documentTarget';
import Invoice from '_/models/invoice/invoice';

const ipcAPI = {
  /**
   * Notify main the renderer is ready
   */
  rendererReady: () => ipcRenderer.send(ipcCommands.rendererReady),

  /**
   * Provides functionality to persist app data
   */
  persistence: {
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
    importObject: <T>(filename: string) => ipcRenderer.invoke(
      ipcCommands.importObject,
      filename,
    ) as Promise<T | null>,

    /**
     * Copies the selected file to the documents
     * @param uploadedFile File that should be copied to the documents
     * @param target Target to which the document is linked to
     * @returns Id of the uploaded document
     */
    uploadDocument: (uploadedFile: string, target: DocumentTarget) => ipcRenderer.invoke(
      ipcCommands.uploadDocument,
      uploadedFile,
      target,
    ) as Promise<string>,
  },

  /**
   * Provides functionality to generate documents
   */
  documentGeneration: {
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
     * @returns id of the generated document
     */
    generateContractPdf: (args: ContractGenerationArgs) => ipcRenderer.invoke(
      ipcCommands.generateContractPdf,
      args,
    ) as Promise<string>,

    /**
     * Generates the rent increase notification as pdf file
     * @returns id of the generated document
     */
    generateRentIncreasePdf: (args: GenerateRentIncreasePdfArgs) => ipcRenderer.invoke(
      ipcCommands.generateRentIncreasePdf,
      args,
    ) as Promise<string>,
  },

  /**
   * Provides functionality to access the file system
   */
  fileSystem: {
    /**
     * Opens a file dialog to select a single file
     * @returns Selected file path or `undefined` if no file was selected
     */
    selectFile: () => ipcRenderer.invoke(ipcCommands.selectFile) as Promise<string | undefined>,
  },

  /**
   * Provides functionality to open additional application windows
   */
  windows: {
    /**
     * Opens a new application window that displays a document
     * @param documentId Id of the document that should be displayed
     * @param target Target to which the document is linked to
     */
    openDocumentWindow: (documentId: string, target: DocumentTarget) => ipcRenderer.invoke(
      ipcCommands.openDocumentWindow,
      documentId,
      target,
    ) as Promise<void>,
  },
};

export default ipcAPI;
