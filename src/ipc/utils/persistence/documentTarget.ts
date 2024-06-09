/**
 * Type describing the target a document is linked to
 */
export type DocumentTarget = ResidentTarget;

/**
 * Document target for a specific resident
 */
type ResidentTarget = {
  type: 'resident';

  /**
   * Id of the resident the document is linked to
   */
  residentId: string;
};
