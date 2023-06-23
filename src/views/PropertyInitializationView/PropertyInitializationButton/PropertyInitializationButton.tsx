import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  PropertyInitializationInput,
  propertyInitializationFormValidationSelector,
} from '../states/property_initialization_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import { propertyState } from '_/states/property/property.state';

/**
 * Button that submits the input property data if they are valid
 */
function PropertyInitializationButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const formValidationState = useRecoilValue(
    propertyInitializationFormValidationSelector,
  );
  const setPropertyState = useSetRecoilState(propertyState);

  const onSuccess = (): void => {
    setPropertyState({
      numberOfApartments: formValidationState.formInput
        .numberOfApartments as number,
    });
  };

  return (
    <FormSubmitButton<PropertyInitializationInput>
      buttonText="Erstellen"
      formState={propertyInitializationFormValidationSelector}
      onSuccess={onSuccess}
    />
  );
}

export default PropertyInitializationButton;
