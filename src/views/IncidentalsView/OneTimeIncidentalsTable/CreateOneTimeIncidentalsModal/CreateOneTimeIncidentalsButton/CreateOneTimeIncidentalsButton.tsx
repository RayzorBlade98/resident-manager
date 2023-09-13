import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import createOneTimeIncidentalsState, {
  CreateOneTimeIncidentalsInput,
  createOneTimeIncidentalsFormValidationSelector,
} from '../../states/create_one_time_incidentals_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import useIncidentalsState from '_/hooks/useIncidentalsState/useIncidentalsState';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * Button that submits the input incidentals data if they are valid
 */
function CreateOneTimeIncidentalsButton(): JSX.Element {
  // eslint-disable-next-line max-len
  const formValidationState = useRecoilValue(
    createOneTimeIncidentalsFormValidationSelector,
  );
  const resetCreateIncidentalsState = useResetRecoilState(
    createOneTimeIncidentalsState,
  );

  const { addOneTimeIncidentals } = useIncidentalsState();

  const onSuccess = (): void => {
    addOneTimeIncidentals({
      id: uuid(),
      name: formValidationState.formInput.name,
      cost: formValidationState.formInput.cost as CurrencyInCents,
      billingDate: formValidationState.formInput.billingDate as Date,
      paymentDate: formValidationState.formInput.paymentDate,
      deductionType: formValidationState.formInput.deductionType,
    });
    resetCreateIncidentalsState();
  };

  return (
    <FormSubmitButton<CreateOneTimeIncidentalsInput>
      buttonText="Erstellen"
      formState={createOneTimeIncidentalsFormValidationSelector}
      onSuccess={onSuccess}
    />
  );
}

export default CreateOneTimeIncidentalsButton;
