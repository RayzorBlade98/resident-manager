/**
 * Enum containing all document types
 */
export enum DocumentType {
  /**
   * Cover letter sent to the resident
   */
  CoverLetter = 'Anschreiben',

  /**
   * Document type representing a contract
   */
  Contract = 'Vertrag',

  /**
   * Document type representing a signed contract
   */
  ContractSigned = 'Vertrag (unterschrieben)',

  /**
   * Document type representing a rent increase notification
   */
  RentIncrease = 'Mieterhöhung',

  /**
   * Document type representing a signed rent increase notification
   */
  RentIncreaseSigned = 'Mieterhöhung (unterschrieben)',
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
   * Date the document was created
   */
  creationDate: Date;

  /**
   * Date the document is about (e.g. contract start for contracts, invoice date for invoices)
   */
  subjectDate: Date;
}
