/**
 * Type describing the target a document is linked to
 */
export type DocumentTarget = ResidentTarget | IncidentalsTarget;

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

/**
 * Document target for a specific incidentals
 */
type IncidentalsTarget = {
  type: 'incidentals';

  /**
   * Id of the incidentals the document is linked to
   */
  incidentalsId: string;
};
