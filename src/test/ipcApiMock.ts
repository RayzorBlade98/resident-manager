/**
 * Mock function for the `importObject`
 */
export const importObjectMock = jest.fn();

/**
 * Mock function for the `exportObject`
 */
export const exportObjectMock = jest.fn();

const mockedIpcAPI: typeof window.ipcAPI = {
  rendererReady: jest.fn(),
  importObject: importObjectMock,
  exportObject: exportObjectMock,
  generateInvoicePdfs: jest.fn(),
};

export default mockedIpcAPI;
