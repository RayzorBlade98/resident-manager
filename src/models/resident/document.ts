/**
 * Enum containing all document types
 */
export enum DocumentType {
  /**
   * document type representing a contract
   */
  Contract = 'Vertrag',
}

/**
 * Object containing information about a document
 */
export interface LinkedDocument {
  /**
   * Unique id of the document
   */
  id: string;

  /**
   * Display name of the document
   */
  name: string;

  /**
   * Type of the document
   */
  type: DocumentType;

  /**
   * Path to the file
   */
  file: string;

  /**
   * Date the document is about (e.g. contract start for contracts, invoice date for invoices)
   */
  date: Date;
}
