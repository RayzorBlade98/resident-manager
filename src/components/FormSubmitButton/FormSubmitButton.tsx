import { Button } from '@mui/material';
import React from 'react';
import { ValidationErrorMessages, Validator } from '_/utils/validation';

interface FormSubmitButtonProps<T extends object> {
  /**
   * Text of the button
   */
  buttonText: string;

  /**
   * Form inputs that should be validated
   */
  formInput: T;

  /**
   * Validator that validates the form input
   */
  validator: Validator<T>;

  /**
   * Callback that is called when the button gets pressed for a valid input
   */
  onSuccess: () => void;

  /**
   * Callback that is called when the button gets pressed for an invalid input
   * @param errors errormessages of the form input
   */
  onError: (errors: ValidationErrorMessages<T>) => void;
}

/**
 * Button that handles form validation when clicked
 */
function FormSubmitButton<T extends object>(
  props: FormSubmitButtonProps<T>,
): JSX.Element {
  const errors = props.validator.validate(props.formInput);
  const isValidInput = Object.keys(errors).length === 0;

  const onSave = (): void => {
    if (isValidInput) {
      props.onSuccess();
    } else {
      props.onError(errors);
    }
  };

  return (
    <Button
      variant="contained"
      color={isValidInput ? 'primary' : 'error'}
      onClick={onSave}
    >
      {props.buttonText}
    </Button>
  );
}

export default FormSubmitButton;
