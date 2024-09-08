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

  /**
   * The incidentals can't be deducted in the invoice
   */
  NotDeductable = 'Nicht abrechenbar',
}
