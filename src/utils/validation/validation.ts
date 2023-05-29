/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define */

import _ from 'lodash';
import { RecoilState, selector } from 'recoil';
import { ValidationConstraint, ValidationConstraints, CONSTRAINT_FUNCTIONS } from './validation_constraints';

/**
 * Object containing an error message for each key of `T` that had an invalid value or `undefined` if it had a valid value.
 */
export type ValidationErrorMessages<T> = {
  [k in keyof T]?: string;
};

/**
 * State that contains all information about a form validation
 */
export type FormValidationState<T extends object> = {
  /**
   * Current form input
   */
  formInput: T;

  /**
   * Current form error messages
   */
  formErrors: ValidationErrorMessages<T>;

  /**
   * Validator that is handling the form validation
   */
  formValidator: Validator<T>;
};

/**
 * State that is using form validation
 */
export type CompleteFormValidationState<
  OtherState,
  InputType extends object,
> = OtherState & {
  formValidation: FormValidationState<InputType>;
};

/**
 * Creates a recoil selector for the form validation state
 * @param recoilState State that contains the validation state
 * @returns Selector for the form validation state
 */
export function createFormValidationStateSelector<
  OtherState,
  InputType extends object,
>(
  recoilState: RecoilState<CompleteFormValidationState<OtherState, InputType>>,
): RecoilState<FormValidationState<InputType>> {
  return selector<FormValidationState<InputType>>({
    key: `${recoilState.key}-formValidation`,
    get: ({ get }) => get(recoilState).formValidation,
    set: ({ set }, newState) => set(recoilState, (state) => {
      const formValidation = newState as FormValidationState<InputType>;
      return {
        ...state,
        formValidation: {
          ...formValidation,
          formErrors: {
            ...formValidation.formErrors,
            ...formValidation.formValidator.validateDifference(
              state.formValidation.formInput,
              formValidation.formInput,
            ),
          },
        },
      };
    }),
  });
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
    const errors = this.validate(newValues, false);
    return _.pickBy(
      errors,
      (_v, k) => oldValues[k as keyof T] !== newValues[k as keyof T],
    ) as ValidationErrorMessages<T>;
  }
}
