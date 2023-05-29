import { Button } from '@mui/material';
import React from 'react';
import { RecoilState, useRecoilState } from 'recoil';
import { FormValidationState } from '_/utils/validation/validation';

interface FormSubmitButtonProps<T extends object> {
  /**
   * Text of the button
   */
  buttonText: string;

  /**
   *
   */
  formState: RecoilState<FormValidationState<T>>;

  /**
   * Callback that is called when the button gets pressed for a valid input
   */
  onSuccess: () => void;
}

/**
 * Button that handles form validation when clicked
 */
function FormSubmitButton<T extends object>(
  props: FormSubmitButtonProps<T>,
): JSX.Element {
  const [formState, setFormState] = useRecoilState(props.formState);
  const errors = formState.formValidator.validate(formState.formInput);
  const isValidInput = Object.keys(errors).length === 0;

  const onSave = (): void => {
    if (isValidInput) {
      props.onSuccess();
    } else {
      setFormState((state) => ({ ...state, formErrors: errors }));
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
