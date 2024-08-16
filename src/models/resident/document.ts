/**
 * Enum containing all document types
 */
export enum DocumentType {
  /**
   * Document type representing a contract
   */
  Contract = 'Vertrag',

  /**
   * Document type representing a rent increase notification
   */
  RentIncrease = 'Mieterhöhung',
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
   * Date the document is about (e.g. contract start for contracts, invoice date for invoices)
   */
  date: Date;
}
