/* eslint-disable import/prefer-default-export */

import Name from '_/models/name';

/**
 * Converts a name to a formatted string
 * @param name name that should be converted
 * @param includeSalutation whether the salutation should be included or not
 * @returns formatted string with the format `salutation firstName lastName`
 */
export function convertNameToString(
  name: Name,
  includeSalutation = false,
): string {
  const salutation = includeSalutation ? `${name.salutation} ` : '';
  return `${salutation}${name.firstName} ${name.lastName}`;
}
