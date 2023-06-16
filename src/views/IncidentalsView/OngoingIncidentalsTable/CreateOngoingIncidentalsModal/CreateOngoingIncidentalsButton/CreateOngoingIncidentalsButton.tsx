import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import createOngoingIncidentalsState, { CreateOngoingIncidentalsInput, createOngoingIncidentalsFormValidationSelector } from '../../states/create_ongoing_incidentals_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import IncidentalsStateManager from '_/states/incidentals/incidentals.state.manager';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Button that submits the input incidentals data if they are valid
 */
function CreateOngoingIncidentalsButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const formValidationState = useRecoilValue(
    createOngoingIncidentalsFormValidationSelector,
  );
  const resetCreateIncidentalsState = useResetRecoilState(
    createOngoingIncidentalsState,
  );

  const onSuccess = (): void => {
    IncidentalsStateManager.addOngoingIncidentals({
      id: uuid(),
      name: formValidationState.formInput.name,
      currentPrice: formValidationState.formInput
        .currentPrice as CurrencyInCents,
      deductionType: formValidationState.formInput.deductionType,
      invoiceInterval: formValidationState.formInput.invoiceInterval as number,
    });
    resetCreateIncidentalsState();
  };

  return (
    <FormSubmitButton<CreateOngoingIncidentalsInput>
      buttonText="Erstellen"
      formState={createOngoingIncidentalsFormValidationSelector}
      onSuccess={onSuccess}
    />
  );
}

export default CreateOngoingIncidentalsButton;
