/* eslint-disable @typescript-eslint/ban-types */
type DeepMock<T> = {
  [K in keyof T]: T[K] extends Function ? jest.Mock : DeepMock<T[K]>;
};

/**
 * Mock functions for the ipcAPI
 */
export const mockedIpcAPIFunctions: DeepMock<typeof window.ipcAPI> = {
  rendererReady: jest.fn(),
  persistence: {
    importObject: jest.fn(),
    exportObject: jest.fn(),
    uploadDocument: jest.fn(),
  },
  documentGeneration: {
    generateInvoicePdfs: jest.fn(),
    generateContractPdf: jest.fn(),
    generateRentIncreasePdf: jest.fn(),
  },
  fileSystem: {
    selectFile: jest.fn(),
  },
};

/**
 * Mocked ipcAPI
 */
const mockedIpcAPI: typeof window.ipcAPI = {
  ...mockedIpcAPIFunctions,
} as const;

export default mockedIpcAPI;
