import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  InitializationInput,
  initializationFormValidationSelector,
} from '../states/initialization_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import { propertyState } from '_/states/property/property.state';

/**
 * Button that submits the input property data if they are valid
 */
function InitializationButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const formValidationState = useRecoilValue(
    initializationFormValidationSelector,
  );
  const setPropertyState = useSetRecoilState(propertyState);

  const onSuccess = (): void => {
    setPropertyState({
      numberOfApartments: formValidationState.formInput
        .numberOfApartments as number,
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
