import { Grid } from '@mui/material';
import React from 'react';
import { useOngoingIncidentals } from '../../../../hooks/useOngoingIncidentals/useOngoingIncidentals';
import { CurrencyInCents } from '../../../../utils/currency/currency.utils';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import Validator from '../../../../utils/validation/validator';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import FileSelect from '_/components/form/FileSelect/FileSelect';
import MonthYearDateField from '_/components/form/MonthYearDateField/MonthYearDateField';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import MonthYear from '_/extensions/date/month_year.extension';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';

interface AddOngoingIncidentalsPaymentModalProps {
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
  incidentals: OngoingIncidentals;
}

/**
 * All values that can be submitted in the form
 */
export interface AddOneTimeIncidentalsPaymentInput {
  /**
   * Cost of the incidentals
   */
  cost: CurrencyInCents;

  /**
   * Date the bill was due
   */
  dueDate: MonthYear;

  /**
   * Date the bill was paid
   */
  paymentDate: Date;

  /**
   * Path to the bill document
   */
  billFile: string | undefined;

  /**
   * Path to the bank transfer document
   */
  bankTransferFile: string;
}

export function AddOngoingIncidentalsPaymentModal(
  props: AddOngoingIncidentalsPaymentModalProps,
) {
  const { addPayment } = useOngoingIncidentals(props.incidentals.id);

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<AddOneTimeIncidentalsPaymentInput>({
    formValidator: new Validator<AddOneTimeIncidentalsPaymentInput>({
      dueDate: ValidationConstraint.Defined,
      paymentDate: ValidationConstraint.Defined,
      cost: ValidationConstraint.Currency,
    }),
    defaultFormInput: {
      dueDate: new MonthYear(),
      paymentDate: new Date().toUTC(),
      cost: props.incidentals.costs.at(0)?.cost,
      billFile: undefined,
      bankTransferFile: undefined,
    },
    onSubmitSuccess: (values) => {
      void Promise.all([
        window.ipcAPI.persistence.uploadDocument(values.bankTransferFile, {
          type: 'incidentals',
          incidentalsId: props.incidentals.id,
        }),
        values.billFile
          ? window.ipcAPI.persistence.uploadDocument(values.billFile, {
            type: 'incidentals',
            incidentalsId: props.incidentals.id,
          })
          : Promise.resolve(undefined),
      ]).then(([bankTransferDocumentId, billDocumentId]) => {
        addPayment({
          cost: values.cost,
          dueDate: values.dueDate,
          paymentDate: values.paymentDate,
          bankTransferDocumentId,
          billDocumentId,
        });
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
          <CurrencyInputField
            required
            id="cost"
            label="Kosten"
            value={formInput.cost}
            onChange={formInputSetters.cost}
            errorMessage={formErrors.cost}
          />
        </Grid>
        <Grid item xs={6}>
          <MonthYearDateField
            required
            id="dueDate"
            label="Abrechnungsdatum"
            value={formInput.dueDate}
            onChange={formInputSetters.dueDate}
            errorMessage={formErrors.dueDate}
          />
        </Grid>
        <Grid item xs={6}>
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
            id="billFile"
            label="Rechnung"
            value={formInput.billFile}
            onChange={formInputSetters.billFile}
            errorMessage={formErrors.billFile}
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
