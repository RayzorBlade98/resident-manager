import { Grid } from '@mui/material';
import React from 'react';
import RentInformationUtils from '../../../../utils/rent/rent.utils';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import Validator from '../../../../utils/validation/validator';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useResident from '_/hooks/useResident/useResident';
import { RentInformation } from '_/models/resident/rent';
import { Resident } from '_/models/resident/resident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

type AddRentPaymentModalProps = {
  /**
   * Whether to show the modal
   */
  show: boolean;

  /**
   * Callback when the modal is closed
   */
  onCloseModal: () => void;

  /**
   * Resident for which the rent payment should be added
   */
  resident: Resident;

  /**
   * Rent information for which the rent should be added
   */
  rentInformation: RentInformation;
};

/**
 * All values that can be submitted in the form
 */
interface AddRentPaymentInput {
  /**
   * Amount of rent that was paid
   */
  paymentAmount: CurrencyInCents;

  /**
   * Date of the payment
   */
  paymentDate: Date;
}

/**
 * Modal that provides functionality to insert payment information
 */
function AddRentPaymentModal(props: AddRentPaymentModalProps): JSX.Element {
  const { addRentPayment } = useResident(props.resident.id);

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<AddRentPaymentInput>({
    formValidator: new Validator<AddRentPaymentInput>({
      paymentAmount: ValidationConstraint.Currency,
      paymentDate: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      paymentAmount: RentInformationUtils.getAmountToPay(props.rentInformation),
      paymentDate: new Date().toUTC(),
    },
    onSubmitSuccess: (values) => {
      addRentPayment({
        dueDate: props.rentInformation.dueDate,
        ...values,
      });
      props.onCloseModal();
    },
    submitButtonLabel: 'Hinzufügen',
  });

  return (
    <GenericModal
      title="Neue Zahlung"
      show={props.show}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <CurrencyInputField
            required
            id="paymentAmount"
            label="Zahlungssumme"
            value={formInput.paymentAmount}
            onChange={formInputSetters.paymentAmount}
            errorMessage={formErrors.paymentAmount}
          />
        </Grid>
        <Grid item xs={6}>
          <StandardDateField
            required
            id="paymentDate"
            label="Zahlungsempfang"
            value={formInput.paymentDate}
            onChange={formInputSetters.paymentDate}
            errorMessage={formErrors.paymentDate}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default AddRentPaymentModal;
