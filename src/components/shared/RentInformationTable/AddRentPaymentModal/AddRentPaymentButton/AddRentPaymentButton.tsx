import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import addRentPaymentState, {
  RentPaymentInput,
  addRentPaymentFormValidationSelector,
} from '_/components/shared/RentInformationTable/states/add_rent_payment_state';
import MonthYear from '_/extensions/date/month_year.extension';
import '_/extensions/date/date.extension';
import useResident from '_/hooks/useResident/useResident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Button that submits the input payment infos if they are valid
 */
function AddRentPaymentButton(): JSX.Element {
  const rentPaymentState = useRecoilValue(addRentPaymentState);
  const resetRentPaymentState = useResetRecoilState(addRentPaymentState);
  const { addRentPayment } = useResident(
    rentPaymentState.selectedResident?.id as string,
  );

  const onSuccess = (): void => {
    addRentPayment({
      dueDate: rentPaymentState.selectedRentMonth as MonthYear,
      paymentAmount: rentPaymentState.formValidation.formInput
        .paymentAmount as CurrencyInCents,
      paymentDate:
        rentPaymentState.formValidation.formInput.paymentDate?.toUTC() as Date,
    });
    resetRentPaymentState();
  };

  return (
    <FormSubmitButton<RentPaymentInput>
      buttonText="Hinzufügen"
      formState={addRentPaymentFormValidationSelector}
      onSuccess={onSuccess}
    />
  );
}

export default AddRentPaymentButton;
