export function convertIntToCurrency(int: number): string {
  const float = (int / 100.0).toFixed(2);
  return `${float}€`;
}

export function convertCurrencyFloatToInt(float: number): number {
  return float * 100;
}
