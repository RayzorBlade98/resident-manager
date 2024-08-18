import Address from '_/models/address';

/**
 * Converts an address to a formatted city string
 * @param address address that should be converted
 * @returns formatted string with the format `zipCode city`
 */
export function convertAddressToCityString(address: Address): string {
  return `${address.zipCode} ${address.city}`;
}

/**
 * Converts an address to a formatted street string
 * @param address address that should be converted
 * @returns formatted string with the format `street houseNumber`
 */
export function convertAddressToStreetString(address: Address): string {
  return `${address.street} ${address.houseNumber}`;
}

/**
 * Converts an address to a formatted string
 * @param address address that should be converted
 * @returns formatted string with the format `street houseNumber,zipCode city`
 */
export function convertAddressToCompleteString(address: Address): string {
  return `${convertAddressToStreetString(address)}, ${convertAddressToCityString(address)}`;
}
