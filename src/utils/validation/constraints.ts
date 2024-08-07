/* eslint-disable  @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define */

/**
 * Enum containing all available validation errors.
 */
export enum ValidationConstraint {
  /**
   * ValidationConstraint that checks if the tested string is not empty.
   */
  NoEmptyString,

  /**
   * ValidationConstraint that checks if the tested array is not empty
   */
  NoEmptyArray,

  /**
   * ValidationConstraint that checks if the tested value is between `1` and `12`.
   */
  Month,

  /**
   * ValidationConstraint that checks if the tested number is a valid currency value (excluding 0).
   */
  Currency,

  /**
   * ValidationConstraint that checks if the tested number is a valid currency value (including 0).
   */
  CurrencyWithZero,

  /**
   * ValidationConstraint that checks if the tested value is defined
   */
  Defined,

  /**
   * ValidationConstraint that checks if the tested file value is defined
   */
  DefinedFile,
}

/**
 * The contraints that each key of `T` must fulfill
 */
export type ValidationConstraints<T> = {
  [k in keyof T]?: ValidationConstraint;
};

/**
 * Object containing a function that checks if a given values is invalid for each `ValidationError`
 */
export const CONSTRAINT_FUNCTIONS: {
  [k in ValidationConstraint]: (value: any) => string | undefined;
} = {
  [ValidationConstraint.Month]: monthConstraint,
  [ValidationConstraint.NoEmptyString]: noEmptyStringConstraint,
  [ValidationConstraint.Currency]: currencyConstraint,
  [ValidationConstraint.CurrencyWithZero]: currencyWithZeroConstraint,
  [ValidationConstraint.Defined]: definedConstraint,
  [ValidationConstraint.NoEmptyArray]: noEmptyArrayConstraint,
  [ValidationConstraint.DefinedFile]: definedFileConstraint,
};

/**
 * Object containing all error messages
 */
export const ERROR_MESSAGES = {
  EMPTY: 'Darf nicht leer sein!',
  NO_FILE: 'Datei ist erforderlich!',
  LTE_ZERO: 'Muss größer als 0 sein!',
  LT_ZERO: 'Muss mindestens 0 sein!',
  NO_INTEGER: 'Muss eine ganze Zahl sein!',
  NO_MONTH: 'Muss zwischen 1 und 12 sein!',
  NO_NUMBER: 'Muss eine Zahl sein!',
};

/**
 * GENERIC CONSTRAINT FUNCTIONS
 */

/**
 * Checks if the value is an integer
 */
function isIntegerConstraint(
  value: string | number | undefined,
): string | undefined {
  if (!value || value === '') {
    return ERROR_MESSAGES.EMPTY;
  }
  const number = Number(value);
  if (Number.isNaN(number) || number % 1 !== 0) {
    return ERROR_MESSAGES.NO_INTEGER;
  }
  return undefined;
}

/**
 * SPECIFIC CONSTRAINT FUNCTIONS
 */

/**
 * Constraint function for the `Currency` constraint
 */
function currencyConstraint(value: number | undefined): string | undefined {
  if (value === undefined) {
    return ERROR_MESSAGES.EMPTY;
  }
  if (value <= 0) {
    return ERROR_MESSAGES.LTE_ZERO;
  }
  return undefined;
}

/**
 * Constraint function for the `CurrencyWithZero` constraint
 */
function currencyWithZeroConstraint(
  value: number | undefined,
): string | undefined {
  if (value === undefined) {
    return ERROR_MESSAGES.EMPTY;
  }
  if (value < 0) {
    return ERROR_MESSAGES.LT_ZERO;
  }
  return undefined;
}

/**
 * Constraint function for the `NoEmptyString` constraint
 */
function noEmptyStringConstraint(value: string): string | undefined {
  if (value === '') {
    return ERROR_MESSAGES.EMPTY;
  }
  return undefined;
}

/**
 *
 */
function noEmptyArrayConstraint<T>(value: T[] | undefined): string | undefined {
  if (!value || !value.length) {
    return ERROR_MESSAGES.EMPTY;
  }
  return undefined;
}

/**
 * Constraint function for the `Month` constraint
 */
function monthConstraint(
  value: string | number | undefined,
): string | undefined {
  const isNoInteger = isIntegerConstraint(value);
  if (isNoInteger) {
    return isNoInteger;
  }
  const number = Number(value);
  if (number < 1 || number > 12) {
    return ERROR_MESSAGES.NO_MONTH;
  }
  return undefined;
}

/**
 * Constraint function for the `Defined` constraint
 */
function definedConstraint(value: any): string | undefined {
  if (value === null || value === undefined) {
    return ERROR_MESSAGES.EMPTY;
  }
  return undefined;
}

/**
 * Constraint function for the `DefinedFile` constraint
 */
function definedFileConstraint(value: any): string | undefined {
  if (value === null || value === undefined) {
    return ERROR_MESSAGES.NO_FILE;
  }
  return undefined;
}
