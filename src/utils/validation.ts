/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define */

import _ from 'lodash';

/**
 * Object containing an error message for each key of `T` that had an invalid value or `undefined` if it had a valid value.
 */
export type ValidationErrorMessages<T> = {
  [k in keyof T]?: string;
};

/**
 * Enum containing all available validation errors.
 */
export enum ValidationConstraint {
  /**
   * ValidationConstraint that checks if the tested string is not empty.
   */
  NoEmptyString,

  /**
   * ValidationConstraint that checks if the tested value is between `1` and `12`.
   */
  Month,

  /**
   * ValidationConstraint that checks if the tested number is a valid currency value.
   */
  Currency,
}

/**
 * Creates a function that validates an object of type `T`.
 * @param errors `ValidationErrors` that should be tested for each key of `T`
 * @returns validation function
 */
export function createValidationFunction<T>(errors: {
  [k in keyof T]?: ValidationConstraint[];
}): (
    object: T,
    key?: keyof T | undefined,
  ) => ValidationErrorMessages<T> | string | undefined {
  /**
   * Validates each key of an object of type `T`
   * @param object object of type `T` that should be validated
   * @param key optional key of `T`. If provided only the error message for this key is returned
   * @returns error message for each invalid key of `object`
   */
  function validationFunction(
    object: T,
    key: keyof T | undefined = undefined,
  ): ValidationErrorMessages<T> | string | undefined {
    const errorMessages: Partial<ValidationErrorMessages<T>> = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [k, value] of Object.entries(errors)) {
      errorMessages[k as keyof T] = undefined;
      if (value === undefined) continue;
      // eslint-disable-next-line no-restricted-syntax
      for (const error of value as ValidationConstraint[]) {
        const errorMessage = CONSTRAINT_FUNCTIONS[error](object[k as keyof T]);
        if (errorMessage) {
          errorMessages[k as keyof T] = errorMessage;
          break;
        }
      }
    }
    if (key) {
      return errorMessages[key];
    }
    return errorMessages;
  }
  return validationFunction;
}

/**
 * The contraints that each key of `T` must fulfill
 */
type ValidationConstraints<T> = {
  [k in keyof T]?: ValidationConstraint;
};

/**
 * Class that provide functionalities to validate objects of type `T`
 */
export class Validator<T extends object> {
  private constraints: ValidationConstraints<T>;

  /**
   * @param constraints constraints that the object values need to fulfill
   */
  public constructor(constraints: ValidationConstraints<T>) {
    this.constraints = constraints;
  }

  /**
   * Validates the given object
   * @param toValidate object that should be validated
   * @param invalidOnly whether only the invalid keys should be included into the returned object or not
   * @returns object containing the error messages for invalid keys of the validated object and undefined for the valid keys.
   */
  public validate(
    toValidate: Partial<T>,
    invalidOnly = true,
  ): ValidationErrorMessages<T> {
    const errorMessages: ValidationErrorMessages<T> = {};
    Object.entries(this.constraints).forEach(([_key, _constraint]) => {
      const key = _key as unknown as keyof T;
      const constraint = _constraint as ValidationConstraint;
      if (constraint === undefined) return;
      errorMessages[key] = CONSTRAINT_FUNCTIONS[constraint](toValidate[key]);
    });

    if (!invalidOnly) {
      return errorMessages;
    }

    return _.pickBy(
      errorMessages,
      (v, _k) => v !== undefined,
    ) as ValidationErrorMessages<T>;
  }

  /**
   * Validates the new values that are different from the old values
   * @param oldValues old values that the new values are compared to
   * @param newValues new values that should be validated
   * @returns object containing the error messages of all keys that have different values than. Only invalid keys will be included.
   */
  public validateDifference(
    oldValues: T,
    newValues: T,
  ): ValidationErrorMessages<T> {
    const difference = _.pickBy(
      newValues,
      (v, k) => oldValues[k as keyof T] !== v,
    );
    return this.validate(difference, false);
  }
}

/**
 * Object containing a function that checks if a given values is invalid for each `ValidationError`
 */
const CONSTRAINT_FUNCTIONS: {
  [k in ValidationConstraint]: (value: any) => string | undefined;
} = {
  [ValidationConstraint.Month]: monthConstraint,
  [ValidationConstraint.NoEmptyString]: noEmptyStringConstraint,
  [ValidationConstraint.Currency]: currencyConstraint,
};

/**
 * Object containing all error messages
 */
const ERROR_MESSAGES = {
  EMPTY: 'Darf nicht leer sein!',
  LT_ZERO: 'Muss größer als 0 sein!',
  NO_INTEGER: 'Muss eine ganze Zahl sein!',
  NO_MONTH: 'Muss zwischen 1 und 12 sein!',
  NO_NUMBER: 'Muss eine Zahl sein!',
};

/**
 * GENERIC CONSTRAINT FUNCTIONS
 */

/**
 * Checks if the value is a number
 */
function isNumberConstraint(
  value: string | number | undefined,
): string | undefined {
  if (!value || value === '') {
    return ERROR_MESSAGES.EMPTY;
  }
  if (Number.isNaN(Number(value))) {
    return ERROR_MESSAGES.NO_NUMBER;
  }
  return undefined;
}

/**
 * Checks if the value is an integer
 */
function isIntegerConstraint(
  value: string | number | undefined,
): string | undefined {
  if (isNumberConstraint(value) || Number(value) % 1 !== 0) {
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
  if (!value) {
    return ERROR_MESSAGES.EMPTY;
  }
  if (value <= 0) {
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
