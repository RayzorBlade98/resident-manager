import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import { CurrencyInCents } from '../../../../../utils/currency/currency.utils';
import RentInformationUtils from '../../../../../utils/rent/rent.utils';
import createResidentState, {
  CreateResidentInput,
  createResidentFormValidationSelector,
} from '../../states/create_resident_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import MonthYear from '_/extensions/date/month_year.extension';
import useResidentState from '_/hooks/useResidentState/useResidentState';

/**
 * Button that submits the input resident data if they are valid
 */
function CreateResidentButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const formValidationState = useRecoilValue(
    createResidentFormValidationSelector,
  );
  const resetCreateResidentState = useResetRecoilState(createResidentState);
  const { addResident } = useResidentState();

  const onSuccess = (): void => {
    addResident({
      id: uuid(),
      firstName: formValidationState.formInput.firstName,
      lastName: formValidationState.formInput.lastName,
      rentInformation: RentInformationUtils.timespan(
        formValidationState.formInput.contractStart as MonthYear,
        new MonthYear(),
        formValidationState.formInput.rent as CurrencyInCents,
        formValidationState.formInput.incidentals as CurrencyInCents,
      ),
      numberOfResidents: formValidationState.formInput
        .numberOfResidents as number,
      contractStart: formValidationState.formInput.contractStart as MonthYear,
      waterMeterReadings: [
        {
          waterMeterCount: formValidationState.formInput.waterMeter as number,
          readingDate: formValidationState.formInput.contractStart as Date,
          wasDeductedInInvoice: true,
        },
      ],
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
