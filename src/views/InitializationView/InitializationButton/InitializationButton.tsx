import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  InitializationInput,
  initializationFormValidationSelector,
} from '../states/initialization_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import MonthYear from '_/extensions/date/month_year.extension';
import propertyState from '_/states/property/property.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Button that submits the input property data if they are valid
 */
function InitializationButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const formValidationState = useRecoilValue(
    initializationFormValidationSelector,
  );
  const setPropertyState = useSetRecoilState(propertyState);
  const setWaterCostState = useSetRecoilState(waterCostsState);

  const onSuccess = (): void => {
    setPropertyState({
      numberOfApartments: formValidationState.formInput
        .numberOfApartments as number,
      address: {
        zipCode: formValidationState.formInput.zipCode as number,
        city: formValidationState.formInput.city,
        street: formValidationState.formInput.street,
        houseNumber: formValidationState.formInput.houseNumber as number,
      },
    });
    setWaterCostState({
      waterUsageCosts: [
        {
          costPerCubicMeter: formValidationState.formInput
            .waterUsageCost as CurrencyInCents,
          date: new MonthYear(),
        },
      ],
      sewageCosts: [
        {
          costPerCubicMeter: formValidationState.formInput
            .sewageCost as CurrencyInCents,
          date: new MonthYear(),
        },
      ],
    });
  };

  return (
    <FormSubmitButton<InitializationInput>
      buttonText="Erstellen"
      formState={initializationFormValidationSelector}
      onSuccess={onSuccess}
    />
  );
}

export default InitializationButton;
