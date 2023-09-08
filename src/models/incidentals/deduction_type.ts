/* eslint-disable import/prefer-default-export */

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
