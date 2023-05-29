import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import createResidentState, {
  CreateResidentInput,
  createResidentFormValidationSelector,
} from '../../states/create_resident_state';
import FormSubmitButton from '_/components/FormSubmitButton/FormSubmitButton';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { MonthYearUtils } from '_/types/date';
import { RentInformationUtils } from '_/types/rent';
import { CurrencyInCents } from '_/utils/currency/currency';

/**
 * Button that submits the input resident data if they are valid
 */
function CreateResidentButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const formValidationState = useRecoilValue(
    createResidentFormValidationSelector,
  );
  const resetCreateResidentState = useResetRecoilState(createResidentState);

  const onSuccess = (): void => {
    ResidentStateManager.addResident({
      id: uuid(),
      firstName: formValidationState.formInput.firstName,
      lastName: formValidationState.formInput.lastName,
      rent: RentInformationUtils.timespan(
        { ...formValidationState.formInput.contractStart },
        MonthYearUtils.getCurrentMonthYear(),
        formValidationState.formInput.rent as CurrencyInCents,
        formValidationState.formInput.incidentals as CurrencyInCents,
      ),
      invoiceStart: { ...formValidationState.formInput.contractStart },
    });
    resetCreateResidentState();
  };

  return (
    <FormSubmitButton<CreateResidentInput>
      buttonText="Erstellen"
      formState={createResidentFormValidationSelector}
      onSuccess={onSuccess}
    />
  );
}

export default CreateResidentButton;
