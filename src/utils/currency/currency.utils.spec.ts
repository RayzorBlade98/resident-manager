import {
  convertCurrencyCentsToEuros,
  convertCurrencyCentsToString,
  convertCurrencyEurosToCents,
} from './currency.utils';

describe('convertCurrencyCentsToString', () => {
  test('should covert to right string', () => {
    // Arrange
    const currency = 12345;
    const expected = '123.45€';

    // Act
    const currencyAsString = convertCurrencyCentsToString(currency);

    // Assert
    expect(currencyAsString).toBe(expected);
  });
});

describe('convertCurrencyEurosToCents', () => {
  test('should convert to right amount', () => {
    // Arrange
    const currencyEuro = 123.45;
    const expected = 12345;

    // Act
    const currencyCents = convertCurrencyEurosToCents(currencyEuro);

    // Assert
    expect(currencyCents).toBe(expected);
  });
});

describe('convertCurrencyCentsToEuros', () => {
  test('should convert to right amount', () => {
    // Arrange
    const currencyCents = 12345;
    const expected = 123.45;

    // Act
    const currencyEuros = convertCurrencyCentsToEuros(currencyCents);

    // Assert
    expect(currencyEuros).toBe(expected);
  });
});
