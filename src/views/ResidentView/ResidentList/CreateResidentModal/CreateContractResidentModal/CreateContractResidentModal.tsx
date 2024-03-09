import { Grid, TextField } from '@mui/material';
import React from 'react';
import { CreateContractResidentFormConfig } from './CreateContractResidentModal.config';
import SalutationSelect from '_/components/form/SalutationSelect/SalutationSelect';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import { Salutation } from '_/models/name';
import { ContractResident } from '_/models/resident/contractResident';

interface CreateContractResidentModalProps {
  /**
   * Whether to show the modal
   */
  show: boolean;

  /**
   * Callback when the modal is closed
   */
  onClose: () => void;

  /**
   * Callback when the resident was successfully created
   */
  onSubmit: (resident: ContractResident) => void;
}

/**
 * Modal that contains an input form to create a new contract resident.
 */
function CreateContractResidentModal(props: CreateContractResidentModalProps) {
  const {
    formInput,
    formInputSetters,
    formErrors,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation({
    ...CreateContractResidentFormConfig,
    onSubmitSuccess: (values) => {
      props.onSubmit({
        name: {
          salutation: values.salutation,
          firstName: values.firstName,
          lastName: values.lastName,
        },
      });
      props.onClose();
    },
  });

  return (
    <GenericModal
      title="Neuer Mieter"
      show={props.show}
      onClose={() => {
        props.onClose();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <SalutationSelect
            value={formInput.salutation as Salutation}
            onChange={formInputSetters.salutation}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="firstName"
            label="Vorname"
            variant="outlined"
            value={formInput.firstName}
            onChange={(event) => formInputSetters.firstName(event.target.value)}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="lastName"
            label="Nachname"
            variant="outlined"
            value={formInput.lastName}
            onChange={(event) => formInputSetters.lastName(event.target.value)}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateContractResidentModal;
