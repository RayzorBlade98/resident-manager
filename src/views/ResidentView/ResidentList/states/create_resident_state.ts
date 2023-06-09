import { atom } from 'recoil';
import { ValidationConstraint } from '../../../../utils/validation/validation_constraints';
import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import {
  CompleteFormValidationState,
  Validator,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';

/**
 * All values that can be submitted in the form
 */
export interface CreateResidentInput {
  /**
   * First name of the new resident
   */
  firstName: string;

  /**
   * Last name of the new resident
   */
  lastName: string;

  /**
   * Rent that the new resident needs to pay
   */
  rent: CurrencyInCents | undefined;

  /**
   * Incidentals that the new resident needs to pay
   */
  incidentals: CurrencyInCents | undefined;

  /**
   * First month and year the contract of the new resident starts
   */
  contractStart: MonthYear | undefined;
}

interface CreateResidentState {
  /**
   * Whether to show the `CreateResidentModal`
   */
  showModal: boolean;
}

/**
 * State for the resident creation
 */
const createResidentState = atom<
CompleteFormValidationState<CreateResidentState, CreateResidentInput>
>({
  key: 'createResidentState',
  default: {
    showModal: false,
    formValidation: {
      formInput: {
        firstName: '',
        lastName: '',
        rent: undefined,
        incidentals: undefined,
        contractStart: new MonthYear(),
      },
      formErrors: {},
      formValidator: new Validator<CreateResidentInput>({
        firstName: ValidationConstraint.NoEmptyString,
        lastName: ValidationConstraint.NoEmptyString,
        rent: ValidationConstraint.Currency,
        incidentals: ValidationConstraint.Currency,
        contractStart: ValidationConstraint.Defined,
      }),
    },
  },
});

/**
 * Selector for the resident creation form validation
 */
// eslint-disable-next-line max-len
export const createResidentFormValidationSelector = createFormValidationStateSelector<CreateResidentState, CreateResidentInput>(
  createResidentState,
);

export default createResidentState;
