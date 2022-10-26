export function convert_int_to_currency(int: number): string {
  const float = (int / 100.0).toFixed(2);
  return `${float}€`;
}

export function convert_currency_float_to_int(float: number): number {
  return float * 100;
}
