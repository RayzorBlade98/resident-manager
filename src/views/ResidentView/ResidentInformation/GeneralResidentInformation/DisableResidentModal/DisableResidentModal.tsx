import { Grid } from '@mui/material';
import React from 'react';
import { ValidationConstraint } from '../../../../../utils/validation/constraints';
import Validator from '../../../../../utils/validation/validator';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useResident from '_/hooks/useResident/useResident';
import { Resident } from '_/models/resident/resident';

type DisableResidentModalProps = {
  /**
   * Resident that should be disabled
   */
  resident: Resident;

  /**
   * Whether to show the modal
   */
  showModal: boolean;

  /**
   * Callback when the modal is closed
   */
  onCloseModal: () => void;
};

type DisableResidentInput = {
  disabledAt: Date;
};

/**
 * Modal that contains an input form to edit an existing resident.
 */
export function DisableResidentModal(props: DisableResidentModalProps): JSX.Element {
  const { disableResident } = useResident(props.resident.id);

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<DisableResidentInput>({
    formValidator: new Validator<DisableResidentInput>({
      disabledAt: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      disabledAt: new Date().toUTC(),
    },
    submitButtonLabel: 'Deaktivieren',
    onSubmitSuccess: (values) => {
      disableResident(values.disabledAt);
      props.onCloseModal();
    },
  });

  return (
    <GenericModal
      title="Mieter deaktivieren"
      show={props.showModal}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <StandardDateField
            required
            id="disabledAt"
            label="Vertragsende"
            value={formInput.disabledAt}
            onChange={formInputSetters.disabledAt}
            errorMessage={formErrors.disabledAt}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}
