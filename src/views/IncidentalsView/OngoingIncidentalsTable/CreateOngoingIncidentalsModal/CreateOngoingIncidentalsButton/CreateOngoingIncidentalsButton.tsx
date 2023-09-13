import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import createOngoingIncidentalsState, {
  CreateOngoingIncidentalsInput,
  createOngoingIncidentalsFormValidationSelector,
} from '../../states/create_ongoing_incidentals_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import MonthYear from '_/extensions/date/month_year.extension';
import useIncidentalsState from '_/hooks/useIncidentalsState/useIncidentalsState';
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

  const { addOngoingIncidentals } = useIncidentalsState();

  const onSuccess = (): void => {
    addOngoingIncidentals({
      id: uuid(),
      name: formValidationState.formInput.name,
      costs: [
        {
          cost: formValidationState.formInput.currentCost as CurrencyInCents,
          date: new MonthYear().addMonths(-12),
        },
      ],
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
