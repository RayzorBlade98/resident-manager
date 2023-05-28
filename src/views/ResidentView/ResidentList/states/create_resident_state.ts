import { atom, selector } from 'recoil';
import { MonthYear, MonthYearUtils } from '_/types/date';
import { CurrencyInCents } from '_/utils/currency/currency';
import {
  ValidationConstraint,
  ValidationErrorMessages,
  Validator,
} from '_/utils/validation';

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

  /**
   * Current form input
   */
  formInput: CreateResidentInput;

  /**
   * Current form error messages
   */
  formErrors: ValidationErrorMessages<CreateResidentInput>;

  /**
   * Validator that is handling the form validation
   */
  formValidator: Validator<CreateResidentInput>;
}

/**
 *
 */
const createResidentState = atom<CreateResidentState>({
  key: 'createResidentState',
  default: {
    showModal: false,
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
});

/**
 *
 */
export const createResidentFormInputSelector = selector<CreateResidentInput>({
  key: 'createResidentState-formInput',
  get: ({ get }) => get(createResidentState).formInput,
  set: ({ set }, input) => {
    set(createResidentState, (state) => ({
      ...state,
      formInput: input as CreateResidentInput,
      formErrors: {
        ...state.formErrors,
        ...state.formValidator.validateDifference(
          state.formInput,
          input as CreateResidentInput,
        ),
      },
    }));
  },
});

/**
 *
 */
export const createResidentFormErrorSelector = selector<
ValidationErrorMessages<CreateResidentInput>
>({
  key: 'createResidentState-formError',
  get: ({ get }) => get(createResidentState).formErrors,
});

export default createResidentState;
