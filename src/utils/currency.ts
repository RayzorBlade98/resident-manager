export type CurrencyInCents = number;
export type CurrencyInEuros = number;

export function convertCurrencyCentsToString(
  currency: CurrencyInCents,
): string {
  const float = (currency / 100.0).toFixed(2);
  return `${float}€`;
}

export function convertCurrencyEurosToCents(
  currency: CurrencyInEuros,
): CurrencyInCents {
  return currency * 100;
}
