import { atom } from 'recoil';
import { MonthYear, MonthYearUtils } from '_/types/date';
import { CurrencyInCents } from '_/utils/currency/currency';
import {
  CompleteFormValidationState,
  Validator,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';
import { ValidationConstraint } from '_/utils/validation/validation_constraints';

/**
 *
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
  contractStart: MonthYear;
}

interface CreateResidentState {
  /**
   *
   */
  showModal: boolean;
}

/**
 *
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
        contractStart: MonthYearUtils.getCurrentMonthYear(),
      },
      formErrors: {},
      formValidator: new Validator<CreateResidentInput>({
        firstName: ValidationConstraint.NoEmptyString,
        lastName: ValidationConstraint.NoEmptyString,
        rent: ValidationConstraint.Currency,
        incidentals: ValidationConstraint.Currency,
      }),
    },
  },
});

/**
 *
 */
// eslint-disable-next-line max-len
export const createResidentFormValidationSelector = createFormValidationStateSelector<CreateResidentState, CreateResidentInput>(
  createResidentState,
);

export default createResidentState;
