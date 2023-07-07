import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Method of how the costs are distributed between the residents
 */
export enum DeductionType {
  /**
   * The costs get split up between each resident
   */
  PerResident = 'Pro Bewohner',

  /**
   * The costs get split up between each apartment
   */
  PerApartment = 'Pro Wohnung',
}

/**
 * Cost information of the incidentals
 */
export interface OngoingIncidentalsCost {
  /**
   * Cost of the incidentals
   */
  cost: CurrencyInCents

  /**
   * Month in which the cost first applies
   */
  date: MonthYear
}

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
  costs: OngoingIncidentalsCost[]

  /**
   * Deduction type of the incidentals
   */
  deductionType: DeductionType;

  /**
   * Inverval in which the incidentals are paid (in months)
   */
  invoiceInterval: number;
}
