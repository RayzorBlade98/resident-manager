import { Grid, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { ValidationConstraint } from '../../../../../../utils/validation/constraints';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';
import Validator from '_/utils/validation/validator';

interface CreateParkingSpaceModalProps {
  /**
   * Whether to show the modal
   */
  showModal: boolean;

  /**
   * Callback when the modal is closed
   */
  onCloseModal: () => void;
}

/**
 * All values that can be submitted in the form
 */
interface CreateParkingSpaceModalInput {
  /**
   * Name of the new parking space
   */
  name: string;
}

/**
 * Modal that contains an input form to create new parking space.
 */
function CreateParkingSpaceModal(
  props: CreateParkingSpaceModalProps,
): JSX.Element {
  const { addParkingSpace } = usePropertyState();

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<CreateParkingSpaceModalInput>({
    formValidator: new Validator<CreateParkingSpaceModalInput>({
      name: ValidationConstraint.NoEmptyString,
    }),
    defaultFormInput: {
      name: '',
    },
    onSubmitSuccess: (values) => {
      addParkingSpace({
        id: uuid(),
        name: values.name,
      });
      props.onCloseModal();
    },
    submitButtonLabel: 'Erstellen',
  });

  return (
    <GenericModal
      title="Neue Garage / Stellplatz"
      show={props.showModal}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            id="name"
            label="Name"
            variant="outlined"
            value={formInput.name}
            onChange={(event) => {
              formInputSetters.name(event.target.value);
            }}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateParkingSpaceModal;
