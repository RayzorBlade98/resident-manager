/**
 * Mock functions for the ipcAPI
 */
export const mockedIpcAPIFunctions: Record<
keyof typeof window.ipcAPI,
jest.Mock
> = {
  rendererReady: jest.fn(),
  importObject: jest.fn(),
  exportObject: jest.fn(),
  generateInvoicePdfs: jest.fn(),
  generateContractPdf: jest.fn(),
  selectFile: jest.fn(),
  uploadDocument: jest.fn(),
};

/**
 * Mocked ipcAPI
 */
const mockedIpcAPI: typeof window.ipcAPI = {
  ...mockedIpcAPIFunctions,
} as const;

export default mockedIpcAPI;
