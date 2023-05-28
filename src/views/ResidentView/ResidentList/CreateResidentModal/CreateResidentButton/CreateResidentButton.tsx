import React from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import createResidentState, {
  CreateResidentInput,
} from '../../states/create_resident_state';
import FormSubmitButton from '_/components/FormSubmitButton/FormSubmitButton';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { MonthYearUtils } from '_/types/date';
import { RentInformationUtils } from '_/types/rent';
import { CurrencyInCents } from '_/utils/currency/currency';
import { ValidationErrorMessages } from '_/utils/validation';

function CreateResidentButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const [residentCreationState, setResidentCreationState] = useRecoilState(createResidentState);
  const resetCreateResidentState = useResetRecoilState(createResidentState);

  const onSuccess = (): void => {
    ResidentStateManager.addResident({
      id: uuid(),
      firstName: residentCreationState.formInput.firstName,
      lastName: residentCreationState.formInput.lastName,
      rent: RentInformationUtils.timespan(
        { ...residentCreationState.formInput.contractStart },
        MonthYearUtils.getCurrentMonthYear(),
        residentCreationState.formInput.rent as CurrencyInCents,
        residentCreationState.formInput.incidentals as CurrencyInCents,
      ),
      invoiceStart: { ...residentCreationState.formInput.contractStart },
    });
    resetCreateResidentState();
  };

  const onError = (
    errors: ValidationErrorMessages<CreateResidentInput>,
  ): void => {
    setResidentCreationState((state) => ({ ...state, formErrors: errors }));
  };

  return (
    <FormSubmitButton<CreateResidentInput>
      buttonText="Erstellen"
      formInput={residentCreationState.formInput}
      validator={residentCreationState.formValidator}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}

export default CreateResidentButton;
