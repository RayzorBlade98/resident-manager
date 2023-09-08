import { atom } from 'recoil';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import { DeductionType } from '_/models/incidentals/deduction_type';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import {
  CompleteFormValidationState,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';
import Validator from '_/utils/validation/validator';
import '_/extensions/date/date.extension';

/**
 * All values that can be submitted in the form
 */
export interface CreateOneTimeIncidentalsInput {
  /**
   * Name of the new incidentals
   */
  name: string;

  /**
   * Cost of the new incidentals
   */
  cost: CurrencyInCents | undefined;

  /**
   * Billing date of the new incidentals
   */
  billingDate: Date | undefined;

  /**
   * Payment date of the new incidentals
   */
  paymentDate: Date | undefined;

  /**
   * Deduction type of the new incidentals
   */
  deductionType: DeductionType;
}

interface CreateOneTimeIncidentalsState {
  /**
   * Whether to show the `CreateOneTimeIncidentalsModal`
   */
  showModal: boolean;
}

/**
 * State for the incidentals creation
 */
const createOneTimeIncidentalsState = atom<
CompleteFormValidationState<
CreateOneTimeIncidentalsState,
CreateOneTimeIncidentalsInput
>
>({
  key: 'createOneTimeIncidentalsState',
  default: {
    showModal: false,
    formValidation: {
      formInput: {
        name: '',
        cost: undefined,
        billingDate: new Date().toUTC(),
        paymentDate: undefined,
        deductionType: DeductionType.PerApartment,
      },
      formErrors: {},
      formValidator: new Validator<CreateOneTimeIncidentalsInput>({
        name: ValidationConstraint.NoEmptyString,
        cost: ValidationConstraint.Currency,
        billingDate: ValidationConstraint.Defined,
      }),
    },
  },
});

/**
 * Selector for the incidentals creation form validation
 */
// eslint-disable-next-line max-len
export const createOneTimeIncidentalsFormValidationSelector = createFormValidationStateSelector<
CreateOneTimeIncidentalsState,
CreateOneTimeIncidentalsInput
>(createOneTimeIncidentalsState);

export default createOneTimeIncidentalsState;
