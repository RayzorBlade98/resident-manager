import { Grid, TextField } from '@mui/material';
import React from 'react';
import {
  CreateContractResidentGroups,
  CreateContractResidentInput,
  createContractResidentModalConfig,
} from './CreateContractResidentModal.config';
import GroupedForm from '_/components/form/GroupedForm/GroupedForm';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
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
    ...createContractResidentModalConfig.formValidationConfig,
    onSubmitSuccess: (values) => {
      props.onSubmit({
        name: {
          salutation: values.salutation,
          firstName: values.firstName,
          lastName: values.lastName,
        },
        oldAddress: {
          zipCode: values.zipCode,
          city: values.city,
          street: values.street,
          houseNumber: values.houseNumber,
        },
        phone: values.phone,
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
      <GroupedForm<CreateContractResidentInput, CreateContractResidentGroups>
        {...createContractResidentModalConfig.formGroupConfig}
        formErrors={formErrors}
      >
        {({ containers }) => (
          <>
            <containers.resident>
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
                <Grid item xs={6}>
                  <TextField
                    required
                    id="phone"
                    label="Telefonnummer"
                    variant="outlined"
                    value={formInput.phone}
                    onChange={(event) => formInputSetters.phone(event.target.value)}
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                  />
                </Grid>
              </Grid>
            </containers.resident>
            <containers.oldAdress>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="zipCode"
                    label="Postleitzahl"
                    value={formInput.zipCode}
                    onChange={formInputSetters.zipCode}
                    errorMessage={formErrors.zipCode}
                    min={1}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="city"
                    label="Stadt"
                    value={formInput.city}
                    onChange={(event) => formInputSetters.city(event.target.value)}
                    error={!!formErrors.city}
                    helperText={formErrors.city}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="street"
                    label="Straße"
                    value={formInput.street}
                    onChange={(event) => formInputSetters.street(event.target.value)}
                    error={!!formErrors.street}
                    helperText={formErrors.street}
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="houseNumber"
                    label="Hausnummer"
                    value={formInput.houseNumber}
                    onChange={formInputSetters.houseNumber}
                    errorMessage={formErrors.houseNumber}
                    min={1}
                    onlyInteger
                  />
                </Grid>
              </Grid>
            </containers.oldAdress>
          </>
        )}
      </GroupedForm>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateContractResidentModal;
