/* eslint-disable import/prefer-default-export */

import Apartment from '_/models/property/apartment';

/**
 * Converts an apartment to a display string with the format `<floor> <location> (<rooms> Zimmer)`
 * @param apartment Apartment that should be converted
 * @returns displayString of the given apartment
 */
export function convertApartmentToDisplayString(apartment: Apartment) {
  return `${apartment.floor} ${apartment.location} (${apartment.rooms.generic} Zimmer)`;
}
