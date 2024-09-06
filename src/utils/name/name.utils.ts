/* eslint-disable import/prefer-default-export */

import Name from '_/models/name';

/**
 * Converts a name to a formatted string
 * @param name name that should be converted
 * @param options options to adjust the conversion
 *  - `includeSalutation`: Whether to include the salutation (default: false)
 *  - `excludeFirstName`: Whether to exclude the first name (default: false)
 * @returns formatted string with the format `salutation firstName lastName`
 */
export function convertNameToString(
  name: Name,
  options?: { includeSalutation?: boolean; excludeFirstName?: boolean },
): string {
  const salutation = options?.includeSalutation ? `${name.salutation} ` : '';
  const firstName = options?.excludeFirstName ? '' : `${name.firstName} `;
  return `${salutation}${firstName}${name.lastName}`;
}
