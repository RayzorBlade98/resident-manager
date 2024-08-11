export type CurrencyInCents = number;
export type CurrencyInEuros = number;

/**
 * Converts the currency to a formatted string
 * @param currency currency (in cents) that should be formatted
 * @returns string representation of the currency (Format: XXX.XX €)
 */
export function convertCurrencyCentsToString(
  currency: CurrencyInCents,
): string {
  const float = (currency / 100.0).toFixed(2);
  return `${float} €`;
}

/**
 * Converts the currency from euros to cents
 * @param currency currency (in euros) that should be converted
 * @returns currency converted to cents
 */
export function convertCurrencyEurosToCents(
  currency: CurrencyInEuros,
): CurrencyInCents {
  return currency * 100;
}

/**
 * Converts the currency from cents to euros
 * @param currency currency (in cents) that should be converted
 * @returns currency converted to euros
 */
export function convertCurrencyCentsToEuros(
  currency: CurrencyInCents,
): CurrencyInEuros {
  return currency / 100.0;
}
