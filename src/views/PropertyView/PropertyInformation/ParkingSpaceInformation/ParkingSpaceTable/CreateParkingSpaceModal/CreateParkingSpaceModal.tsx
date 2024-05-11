import { Grid, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { ValidationConstraint } from '../../../../../../utils/validation/constraints';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import MonthYear from '_/extensions/date/month_year.extension';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
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

  /**
   * Cost of the parking space
   */
  cost: CurrencyInCents;
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
      cost: ValidationConstraint.Currency,
    }),
    defaultFormInput: {
      name: '',
      cost: undefined,
    },
    onSubmitSuccess: (values) => {
      addParkingSpace({
        id: uuid(),
        name: values.name,
        costs: [
          {
            cost: values.cost,
            date: MonthYear.fromDate(new Date(0)),
          },
        ],
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
        <Grid item xs={6}>
          <CurrencyInputField
            required
            id="cost"
            label="Kosten"
            value={formInput.cost}
            onChange={formInputSetters.cost}
            errorMessage={formErrors.cost}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateParkingSpaceModal;
