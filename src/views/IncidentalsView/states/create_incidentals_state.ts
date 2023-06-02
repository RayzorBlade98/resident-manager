import { atom } from 'recoil';
import { DeductionType } from '../../../types/incidentals';
import { ValidationConstraint } from '../../../utils/validation/validation_constraints';
import { CurrencyInCents } from '_/utils/currency/currency';
import {
  CompleteFormValidationState,
  Validator,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';

/**
 * All values that can be submitted in the form
 */
export interface CreateIncidentalsInput {
  /**
   * Name of the new incidentals
   */
  name: string;

  /**
   * Cost of the new incidentals
   */
  currentPrice: CurrencyInCents | undefined;

  /**
   * Deduction type of the new incidentals
   */
  deductionType: DeductionType;

  /**
   * Interval in which the new incidentals need to be payed
   */
  invoiceInterval: number | undefined;
}

interface CreateIncidentalsState {
  /**
   * Whether to show the `CreateIncidentalsModal`
   */
  showModal: boolean;
}

/**
 * State for the incidentals creation
 */
const createIncidentalsState = atom<
CompleteFormValidationState<CreateIncidentalsState, CreateIncidentalsInput>
>({
  key: 'createIncidentalsState',
  default: {
    showModal: false,
    formValidation: {
      formInput: {
        name: '',
        currentPrice: undefined,
        deductionType: DeductionType.PerApartment,
        invoiceInterval: undefined,
      },
      formErrors: {},
      formValidator: new Validator<CreateIncidentalsInput>({
        name: ValidationConstraint.NoEmptyString,
        currentPrice: ValidationConstraint.Currency,
        invoiceInterval: ValidationConstraint.Defined,
      }),
    },
  },
});

/**
 * Selector for the incidentals creation form validation
 */
// eslint-disable-next-line max-len
export const createIncidentalsFormValidationSelector = createFormValidationStateSelector<
CreateIncidentalsState,
CreateIncidentalsInput
>(createIncidentalsState);

export default createIncidentalsState;
