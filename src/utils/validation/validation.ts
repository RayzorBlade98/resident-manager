/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define */

import { RecoilState, selector } from 'recoil';
import Validator from './validator';

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
