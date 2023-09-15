import { OngoingCost } from '../OngoingCost';
import { DeductionType } from './deduction_type';

/**
 * Object containing information about ongoing incidentals
 */
export interface OngoingIncidentals {
  /**
   * Unique id that is used to identify these incidentals
   */
  id: string;

  /**
   * Name of the incidentals
   */
  name: string;

  /**
   * History of all costs
   */
  costs: OngoingCost[];

  /**
   * Deduction type of the incidentals
   */
  deductionType: DeductionType;

  /**
   * Inverval in which the incidentals are paid (in months)
   */
  invoiceInterval: number;
}
