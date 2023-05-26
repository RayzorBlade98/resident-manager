/* eslint-disable @typescript-eslint/no-explicit-any */

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
   * ValidationConstraint that checks if the tested value is not an empty string.
   */
  NotEmptyString = 'NotEmptyString',
  /**
   * ValidationConstraint that checks if the tested value is not `null`.
   */
  NotNull = 'NotNull',
  /**
   * ValidationConstraint that checks if the tested value is greater than `0`.
   */
  GreaterThanZero = 'GreaterThanZero',
  /**
   * ValidationConstraint that checks if the tested value is an integer.
   */
  Integer = 'Integer',
  /**
   * ValidationConstraint that checks if the tested value is between `1` and `12`.
   */
  Month = 'Month',
}

/**
 * Object containing an error message for each `ValidationError`
 */
const ERROR_MESSAGES: { [k in ValidationConstraint]: string } = {
  [ValidationConstraint.NotEmptyString]: 'Darf nicht leer sein!',
  [ValidationConstraint.NotNull]: 'Darf nicht leer sein!',
  [ValidationConstraint.GreaterThanZero]: 'Muss größer als 0 sein!',
  [ValidationConstraint.Integer]: 'Muss eine ganze Zahl sein!',
  [ValidationConstraint.Month]: 'Muss zwischen 1 und 12 sein!',
};

/**
 * Object containing a function that checks if a given values is invalid for each `ValidationError`
 */
const CONSTRAINT_FUNCTIONS: {
  [k in ValidationConstraint]: (value: any) => boolean;
} = {
  [ValidationConstraint.NotEmptyString]: (value: any) => value !== '',
  [ValidationConstraint.NotNull]: (value: any) => value !== null,
  [ValidationConstraint.GreaterThanZero]: (value: any) => value > 0,
  [ValidationConstraint.Integer]: (value: any) => value % 1 === 0,
  [ValidationConstraint.Month]: (value: any) => value >= 1 && value <= 12,
};

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
        if (!CONSTRAINT_FUNCTIONS[error](object[k as keyof T])) {
          errorMessages[k as keyof T] = ERROR_MESSAGES[error];
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
  [k in keyof T]?: ValidationConstraint[];
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
    invalidOnly = false,
  ): ValidationErrorMessages<T> {
    const errorMessages: ValidationErrorMessages<T> = {};
    Object.entries(this.constraints).forEach((_key, constraints) => {
      const key = _key as unknown as keyof T;
      errorMessages[key] = undefined;
      if (constraints === undefined) return;
      (constraints as unknown as ValidationConstraint[]).forEach(
        (constraint) => {
          if (errorMessages[key]) {
            // An error has already been found
            return;
          }

          if (!CONSTRAINT_FUNCTIONS[constraint](toValidate[key])) {
            errorMessages[key] = ERROR_MESSAGES[constraint];
          }
        },
      );
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
    return this.validate(difference, true);
  }
}
