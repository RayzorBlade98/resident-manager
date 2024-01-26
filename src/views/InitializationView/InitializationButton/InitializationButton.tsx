import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  InitializationInput,
  initializationFormValidationSelector,
} from '../states/initialization_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import MonthYear from '_/extensions/date/month_year.extension';
import landlordState from '_/states/landlord/landlord.state';
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
  const setLandlordState = useSetRecoilState(landlordState);

  const onSuccess = (): void => {
    setLandlordState({
      company:
        formValidationState.formInput.companyLandlord.length > 0
          ? formValidationState.formInput.companyLandlord
          : undefined,
      representative: {
        salutation: formValidationState.formInput.salutationLandlord,
        firstName: formValidationState.formInput.firstNameLandlord,
        lastName: formValidationState.formInput.lastNameLandlord,
      },
      address: {
        zipCode: formValidationState.formInput.zipCodeLandlord as number,
        city: formValidationState.formInput.cityLandlord,
        street: formValidationState.formInput.streetLandlord,
        houseNumber: formValidationState.formInput.houseNumberLandlord as number,
      },
    });
    setPropertyState({
      numberOfApartments: formValidationState.formInput
        .numberOfApartments as number,
      address: {
        zipCode: formValidationState.formInput.zipCodeProperty as number,
        city: formValidationState.formInput.cityProperty,
        street: formValidationState.formInput.streetProperty,
        houseNumber: formValidationState.formInput
          .houseNumberProperty as number,
      },
      apartments: [],
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
