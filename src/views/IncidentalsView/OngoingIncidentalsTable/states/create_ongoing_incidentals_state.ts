import { atom } from 'recoil';
import { DeductionType } from '../../../../models/incidentals/ongoing_incidentals';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import {
  CompleteFormValidationState,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';
import Validator from '_/utils/validation/validator';

/**
 * All values that can be submitted in the form
 */
export interface CreateOngoingIncidentalsInput {
  /**
   * Name of the new incidentals
   */
  name: string;

  /**
   * Cost of the new incidentals
   */
  currentCost: CurrencyInCents | undefined;

  /**
   * Deduction type of the new incidentals
   */
  deductionType: DeductionType;

  /**
   * Interval in which the new incidentals need to be payed
   */
  invoiceInterval: number | undefined;
}

interface CreateOngoingIncidentalsState {
  /**
   * Whether to show the `CreateIncidentalsModal`
   */
  showModal: boolean;
}

/**
 * State for the incidentals creation
 */
const createOngoingIncidentalsState = atom<
CompleteFormValidationState<
CreateOngoingIncidentalsState,
CreateOngoingIncidentalsInput
>
>({
  key: 'createOngoingIncidentalsState',
  default: {
    showModal: false,
    formValidation: {
      formInput: {
        name: '',
        currentCost: undefined,
        deductionType: DeductionType.PerApartment,
        invoiceInterval: undefined,
      },
      formErrors: {},
      formValidator: new Validator<CreateOngoingIncidentalsInput>({
        name: ValidationConstraint.NoEmptyString,
        currentCost: ValidationConstraint.Currency,
        invoiceInterval: ValidationConstraint.Defined,
      }),
    },
  },
});

/**
 * Selector for the incidentals creation form validation
 */
// eslint-disable-next-line max-len
export const createOngoingIncidentalsFormValidationSelector = createFormValidationStateSelector<
CreateOngoingIncidentalsState,
CreateOngoingIncidentalsInput
>(createOngoingIncidentalsState);

export default createOngoingIncidentalsState;
