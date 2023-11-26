import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import usePreviousValue from '../usePreviousValue';
import OptionallyDefined from '_/types/OptionallyDefined';
import Validator from '_/utils/validation/validator';

interface FormValidationArguments<T extends object> {
  /**
   * Validator that validates the form input
   */
  formValidator: Validator<T>;

  /**
   * Default input values of the form
   */
  defaultFormInput: FormInput<T>;

  /**
   * Callback when the form was successfully submitted
   * @param formInput Submitted valid input of the form
   */
  onSubmitSuccess: (formInput: T) => void;
}

type FormErrors<T> = Partial<Record<keyof T, string>>;
type FormInput<T> = OptionallyDefined<T>;

/**
 * Hook that manages form state and validation
 */
function useFormValidation<T extends object>(args: FormValidationArguments<T>) {
  // State
  const [formInput, setFormInput] = useState<FormInput<T>>(
    args.defaultFormInput,
  );
  const [formErrors, setFormErrors] = useState<FormErrors<T>>({});

  // Used hooks
  const previousFormInput = usePreviousValue(formInput);

  // Memos
  const formInputSetters = useMemo(
    () => Object.fromEntries(
      Object.keys(args.defaultFormInput).map((key) => [
        key as keyof T,
        (newValue: T[keyof T] | undefined) => {
          setFormInput((oldInput) => ({ ...oldInput, [key]: newValue }));
        },
      ]),
    ) as unknown as {
      [K in keyof T]: (newValue: T[K] | undefined) => void;
    },
    [setFormInput, args.defaultFormInput],
  );

  const allFormErrors = useMemo(
    () => args.formValidator.validate(formInput),
    [formInput, args.formValidator],
  );

  const isFormInputValid = useMemo(
    () => Object.keys(allFormErrors).length === 0,
    [allFormErrors],
  );

  // Callbacks
  const resetFormInput = useCallback(() => {
    setFormInput(args.defaultFormInput);
    setFormErrors({});
  }, [setFormInput, setFormErrors, args.defaultFormInput]);

  const submitForm = useCallback(() => {
    if (isFormInputValid) {
      args.onSubmitSuccess(formInput as T);
      resetFormInput();
    } else {
      setFormErrors(allFormErrors);
    }
  }, [
    formInput,
    setFormErrors,
    resetFormInput,
    allFormErrors,
    isFormInputValid,
    args,
  ]);

  // Hooks
  useEffect(() => {
    setFormErrors((oldErrors) => ({
      ...oldErrors,
      ...args.formValidator.validateDifference(previousFormInput, formInput),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formInput, previousFormInput]);

  return {
    /**
     * Current input values of the form
     */
    formInput,

    /**
     * Current errors of the form input
     */
    formErrors,

    /**
     * Setter-functions for every individual form input
     */
    formInputSetters,

    /**
     * Function to submit the form input
     */
    submitForm,

    /**
     * Function to reset the form input to its default values
     */
    resetFormInput,

    /**
     * Whether the current form input is valid or not
     */
    isFormInputValid,
  };
}

export default useFormValidation;
