import { Grid } from '@mui/material';
import React from 'react';
import { useOneTimeIncidentals } from '../../../../hooks/useOneTimeIncidentals/useOneTimeIncidentals';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import Validator from '../../../../utils/validation/validator';
import FileSelect from '_/components/form/FileSelect/FileSelect';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';

interface AddOneTimeIncidentalsPaymentModalProps {
  /**
   * Whether to show the modal
   */
  show: boolean;

  /**
   * Callback when the modal is closed
   */
  onCloseModal: () => void;

  /**
   * Incidentals for which the payment should be added
   */
  incidentals: OneTimeIncidentals;
}

/**
 * All values that can be submitted in the form
 */
export interface AddOneTimeIncidentalsPaymentInput {
  /**
   * Date the bill was paid
   */
  paymentDate: Date;

  /**
   * Path to the bank transfer document
   */
  bankTransferFile: string | undefined;
}

/**
 * Modal that contains an input form to add a payment to the selected one time incidentals
 */
export function AddOneTimeIncidentalsPaymentModal(
  props: AddOneTimeIncidentalsPaymentModalProps,
) {
  const { addPayment } = useOneTimeIncidentals(props.incidentals.id);

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<AddOneTimeIncidentalsPaymentInput>({
    formValidator: new Validator<AddOneTimeIncidentalsPaymentInput>({
      paymentDate: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      paymentDate: props.incidentals.billingDate,
      bankTransferFile: undefined,
    },
    onSubmitSuccess: (values) => {
      void (
        values.bankTransferFile
          ? window.ipcAPI.persistence.uploadDocument(values.bankTransferFile, {
            type: 'incidentals',
            incidentalsId: props.incidentals.id,
          })
          : Promise.resolve(undefined)
      ).then((bankTransferDocumentId) => {
        addPayment({ paymentDate: values.paymentDate, bankTransferDocumentId });
        props.onCloseModal();
      });
    },
    submitButtonLabel: 'Hinzufügen',
  });

  return (
    <GenericModal
      title="Zahlung hinzufügen"
      show={props.show}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <StandardDateField
            required
            id="paymentDate"
            label="Zahlungsdatum"
            value={formInput.paymentDate}
            onChange={formInputSetters.paymentDate}
            errorMessage={formErrors.paymentDate}
          />
        </Grid>
        <Grid item xs={12}>
          <FileSelect
            id="bankTransferFile"
            label="Überweisung"
            value={formInput.bankTransferFile}
            onChange={formInputSetters.bankTransferFile}
            errorMessage={formErrors.bankTransferFile}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}
