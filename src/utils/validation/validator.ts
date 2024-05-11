import _ from 'lodash';
import {
  ValidationConstraint,
  ValidationConstraints,
  CONSTRAINT_FUNCTIONS,
} from './constraints';
import { ValidationErrorMessages } from './validation';
import OptionallyDefined from '_/types/OptionallyDefined';

/**
 * Class that provide functionalities to validate objects of type `T`
 */

export default class Validator<T extends object> {
  public constraints: ValidationConstraints<T>;

  /**
   * @param constraints constraints that the object values need to fulfill
   */
  public constructor(constraints: ValidationConstraints<T>) {
    this.constraints = Object.freeze(constraints);
  }

  /**
   * Validates the given object
   * @param toValidate object that should be validated
   * @param invalidOnly whether only the invalid keys should be included into the returned object or not
   * @returns object containing the error messages for invalid keys of the validated object and undefined for the valid keys.
   */
  public validate(
    toValidate: Partial<T> | OptionallyDefined<T>,
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
    oldValues: OptionallyDefined<T>,
    newValues: OptionallyDefined<T>,
  ): ValidationErrorMessages<T> {
    const errors = this.validate(newValues, false);
    return _.pickBy(
      errors,
      (_v, k) => oldValues[k as keyof T] !== newValues[k as keyof T],
    ) as ValidationErrorMessages<T>;
  }
}
