import { Grid, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import DeductionTypeSelect from '_/components/form/DeductionTypeSelect/DeductionTypeSelect';
import FileSelect from '_/components/form/FileSelect/FileSelect';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useIncidentalsState from '_/hooks/useIncidentalsState/useIncidentalsState';
import { DeductionType } from '_/models/incidentals/deduction_type';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import Validator from '_/utils/validation/validator';

interface CreateOneTimeIncidentalsModalProps {
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
interface CreateOneTimeIncidentalsInput {
  /**
   * Name of the new incidentals
   */
  name: string;

  /**
   * Cost of the new incidentals
   */
  cost: CurrencyInCents;

  /**
   * Billing date of the new incidentals
   */
  billingDate: Date;

  /**
   * Deduction type of the new incidentals
   */
  deductionType: DeductionType;

  /**
   * Path to the bill document
   */
  billFile: string | undefined;
}

/**
 * Modal that contains an input form to create new one-time incidentals.
 */
function CreateOneTimeIncidentalsModal(
  props: CreateOneTimeIncidentalsModalProps,
): JSX.Element {
  const { addOneTimeIncidentals } = useIncidentalsState();

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<CreateOneTimeIncidentalsInput>({
    formValidator: new Validator<CreateOneTimeIncidentalsInput>({
      name: ValidationConstraint.NoEmptyString,
      cost: ValidationConstraint.Currency,
      billingDate: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      name: '',
      cost: undefined,
      billingDate: new Date().toUTC(),
      deductionType: DeductionType.PerApartment,
      billFile: undefined,
    },
    onSubmitSuccess: (values) => {
      const id = uuid();
      void (values.billFile
        ? window.ipcAPI.persistence.uploadDocument(values.billFile, {
          type: 'incidentals',
          incidentalsId: id,
        })
        : Promise.resolve(undefined)
      ).then((billDocumentId) => {
        addOneTimeIncidentals({
          id,
          name: values.name,
          cost: values.cost,
          billingDate: values.billingDate,
          deductionType: values.deductionType,
          billDocumentId,
        });
        props.onCloseModal();
      });
    },
    submitButtonLabel: 'Erstellen',
  });

  return (
    <GenericModal
      title="Neue Nebenkosten"
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
        <Grid item xs={6}>
          <DeductionTypeSelect
            value={formInput.deductionType as DeductionType}
            onChange={formInputSetters.deductionType}
          />
        </Grid>
        <Grid item xs={6}>
          <StandardDateField
            required
            label="Rechnungsdatum"
            id="billingDate"
            value={formInput.billingDate}
            onChange={formInputSetters.billingDate}
            errorMessage={formErrors.billingDate}
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
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateOneTimeIncidentalsModal;
