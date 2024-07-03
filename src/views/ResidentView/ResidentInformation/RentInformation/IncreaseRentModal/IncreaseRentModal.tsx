import { Grid } from '@mui/material';
import React from 'react';
import { CurrencyInCents } from '../../../../../utils/currency/currency.utils';
import { ValidationConstraint } from '../../../../../utils/validation/constraints';
import Validator from '../../../../../utils/validation/validator';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import MonthYearDateField from '_/components/form/MonthYearDateField/MonthYearDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import MonthYear from '_/extensions/date/month_year.extension';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useResident from '_/hooks/useResident/useResident';
import { Resident } from '_/models/resident/resident';

/**
 * All values that can be submitted in the form
 */
type IncreaseRentModalInput = {
  /**
   * New rent after increase
   */
  newRent: CurrencyInCents;

  /**
   * First month the new rent should be applied
   */
  firstMonth: MonthYear;
};

interface IncreaseRentModalProps {
  /**
   * Resident for which the rent should be increased
   */
  resident: Resident;

  /**
   * Whether to show the modal
   */
  show: boolean;

  /**
   * Callback when the modal is closed
   */
  onClose: () => void;
}

/**
 * Modal that contains an input form to increase the rent of a resident
 */
function IncreaseRentModal(props: IncreaseRentModalProps) {
  const { increaseRent } = useResident(props.resident.id);
  const {
    formInput,
    formInputSetters,
    formErrors,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<IncreaseRentModalInput>({
    formValidator: new Validator({
      newRent: ValidationConstraint.Currency,
      firstMonth: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      newRent: undefined,
      firstMonth: new MonthYear().addMonths(1),
    },
    submitButtonLabel: 'Bestätigen',
    onSubmitSuccess: (values) => {
      increaseRent({
        newRent: values.newRent,
        monthForIncrease: values.firstMonth,
      });
      props.onClose();
    },
  });

  return (
    <GenericModal
      title="Miete erhöhen"
      show={props.show}
      onClose={() => {
        props.onClose();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <CurrencyInputField
            required
            id="newRent"
            label="Neue Miete"
            value={formInput.newRent}
            onChange={formInputSetters.newRent}
            errorMessage={formErrors.newRent}
          />
        </Grid>
        <Grid item xs={6}>
          <MonthYearDateField
            required
            id="firstMonth"
            label="Monat der Erhöhung"
            value={formInput.firstMonth}
            onChange={formInputSetters.firstMonth}
            errorMessage={formErrors.firstMonth}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default IncreaseRentModal;
