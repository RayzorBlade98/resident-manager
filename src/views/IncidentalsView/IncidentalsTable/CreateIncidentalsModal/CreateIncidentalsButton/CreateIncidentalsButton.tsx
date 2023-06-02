import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import createIncidentalsState, {
  CreateIncidentalsInput,
  createIncidentalsFormValidationSelector,
} from '../../states/create_incidentals_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import { IncidentalsStateManager } from '_/states/saveStates/incidentals_state';
import { CurrencyInCents } from '_/utils/currency/currency';

/**
 * Button that submits the input incidentals data if they are valid
 */
function CreateIncidentalsButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const formValidationState = useRecoilValue(
    createIncidentalsFormValidationSelector,
  );
  const resetCreateResidentState = useResetRecoilState(createIncidentalsState);

  const onSuccess = (): void => {
    IncidentalsStateManager.addIncidentals({
      id: uuid(),
      name: formValidationState.formInput.name,
      currentPrice: formValidationState.formInput
        .currentPrice as CurrencyInCents,
      deductionType: formValidationState.formInput.deductionType,
      invoiceInterval: formValidationState.formInput.invoiceInterval as number,
    });
    resetCreateResidentState();
  };

  return (
    <FormSubmitButton<CreateIncidentalsInput>
      buttonText="Erstellen"
      formState={createIncidentalsFormValidationSelector}
      onSuccess={onSuccess}
    />
  );
}

export default CreateIncidentalsButton;
