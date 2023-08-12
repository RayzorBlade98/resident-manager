import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import addRentPaymentState, {
  RentPaymentInput,
  addRentPaymentFormValidationSelector,
} from '_/components/shared/RentInformationTable/states/add_rent_payment_state';
import MonthYear from '_/extensions/date/month_year.extension';
import { Resident } from '_/models/resident/resident';
import ResidentStateManager from '_/states/resident/resident.state.manager';
import '_/extensions/date/date.extension';

/**
 * Button that submits the input payment infos if they are valid
 */
function AddRentPaymentButton(): JSX.Element {
  const rentPaymentState = useRecoilValue(addRentPaymentState);
  const resetRentPaymentState = useResetRecoilState(addRentPaymentState);

  const onSuccess = (): void => {
    ResidentStateManager.updateRentInformation(
      (rentPaymentState.selectedResident as Resident).id,
      rentPaymentState.selectedRentMonth as MonthYear,
      {
        paymentAmount: rentPaymentState.formValidation.formInput.paymentAmount,
        paymentDate:
          rentPaymentState.formValidation.formInput.paymentDate?.toUTC(),
      },
    );
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
