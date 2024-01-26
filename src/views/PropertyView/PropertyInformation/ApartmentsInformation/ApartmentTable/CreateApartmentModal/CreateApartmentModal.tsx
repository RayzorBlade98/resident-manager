import { Grid, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { ValidationConstraint } from '../../../../../../utils/validation/constraints';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';
import Validator from '_/utils/validation/validator';

interface CreateApartmentModalProps {
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
interface CreateApartmentInput {
  /**
   * Floor in which the apartment is located
   */
  floor: string;

  /**
   * Location of the aparment on its floor
   */
  location: string;

  /**
   * Number of rooms in the apartment (excluding bath, kitchen etc.)
   */
  rooms: number;
}

/**
 * Modal that contains an input form to create new apartment.
 */
function CreateApartmentModal(props: CreateApartmentModalProps) {
  const { addApartment } = usePropertyState();
  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<CreateApartmentInput>({
    formValidator: new Validator<CreateApartmentInput>({
      floor: ValidationConstraint.NoEmptyString,
      location: ValidationConstraint.NoEmptyString,
      rooms: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      floor: '',
      location: '',
      rooms: undefined,
    },
    onSubmitSuccess: (values) => {
      addApartment({
        ...values,
        id: uuid(),
      });
      props.onCloseModal();
    },
    submitButtonLabel: 'Erstellen',
  });

  return (
    <GenericModal
      title="Neue Wohnung"
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
            id="floor"
            label="Geschoss"
            variant="outlined"
            value={formInput.floor}
            onChange={(event) => {
              formInputSetters.floor(event.target.value);
            }}
            error={!!formErrors.floor}
            helperText={formErrors.floor}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            id="location"
            label="Lage"
            variant="outlined"
            value={formInput.location}
            onChange={(event) => {
              formInputSetters.location(event.target.value);
            }}
            error={!!formErrors.location}
            helperText={formErrors.location}
          />
        </Grid>
        <Grid item xs={6}>
          <NumberTextField
            required
            id="rooms"
            label="Anzahl der Räume"
            min={1}
            value={formInput.rooms}
            onChange={formInputSetters.rooms}
            errorMessage={formErrors.rooms}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateApartmentModal;
