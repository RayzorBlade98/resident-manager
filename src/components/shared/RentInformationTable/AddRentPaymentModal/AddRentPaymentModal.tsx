import { Grid } from '@mui/material';
import React from 'react';
import RentInformationUtils from '../../../../utils/rent/rent.utils';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import Validator from '../../../../utils/validation/validator';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import FileSelect from '_/components/form/FileSelect/FileSelect';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useResident from '_/hooks/useResident/useResident';
import { DocumentType } from '_/models/resident/document';
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

  /**
   * Path to the bank transfer document
   */
  bankTransferFile: string;
}

/**
 * Modal that provides functionality to insert payment information
 */
function AddRentPaymentModal(props: AddRentPaymentModalProps): JSX.Element {
  const { addRentPayment, addDocument } = useResident(props.resident.id);

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
      bankTransferFile: ValidationConstraint.DefinedFile,
    }),
    defaultFormInput: {
      paymentAmount: RentInformationUtils.getAmountToPay(props.rentInformation),
      paymentDate: new Date().toUTC(),
      bankTransferFile: undefined,
    },
    onSubmitSuccess: (values) => {
      void window.ipcAPI.persistence
        .uploadDocument(values.bankTransferFile, {
          type: 'resident',
          residentId: props.resident.id,
        })
        .then((bankTransferDocumentId) => {
          addDocument({
            name: `Mietzahlung ${props.rentInformation.dueDate.toString()}`,
            type: DocumentType.BankTransfer,
            creationDate: values.paymentDate,
            subjectDate: props.rentInformation.dueDate,
            id: bankTransferDocumentId,
          });
          addRentPayment({
            dueDate: props.rentInformation.dueDate,
            paymentAmount: values.paymentAmount,
            paymentDate: values.paymentDate,
            bankTransferDocumentId,
          });
          props.onCloseModal();
        });
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

export default AddRentPaymentModal;
