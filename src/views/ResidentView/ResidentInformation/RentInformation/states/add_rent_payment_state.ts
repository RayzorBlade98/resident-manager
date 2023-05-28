import { atom, selector } from 'recoil';
import { MonthYear } from '_/types/date';
import { CurrencyInCents } from '_/utils/currency/currency';
import {
  ValidationConstraint,
  ValidationErrorMessages,
  Validator,
} from '_/utils/validation';

/**
 * Inout values of the `AddRentPaymentModal`
 */
export interface RentPaymentInput {
  /**
   * Amount of money that was paid
   */
  paymentAmount: CurrencyInCents | undefined;

  /**
   * Date of the payment
   */
  paymentDate: Date | undefined;
}

interface AddRentPaymentState {
  /**
   * Month for which the rent payment is added
   */
  selectedRentMonth?: MonthYear;

  /**
   * Whether to show the `AddRentPaymentModal`
   */
  showModal: boolean;

  /**
   * Current form input
   */
  formInput: RentPaymentInput;

  /**
   * Current form error messages
   */
  formErrors: ValidationErrorMessages<RentPaymentInput>;

  /**
   * Validator that is handling the form validation
   */
  formValidator: Validator<RentPaymentInput>;
}

/**
 * State that holds all information of the rent payment adding process
 */
const addRentPaymentState = atom<AddRentPaymentState>({
  key: 'addRentPaymentState',
  default: {
    selectedRentMonth: undefined,
    showModal: false,
    formInput: {
      paymentAmount: undefined,
      paymentDate: new Date(),
    },
    formErrors: {},
    formValidator: new Validator<RentPaymentInput>({
      paymentAmount: ValidationConstraint.Currency,
      paymentDate: ValidationConstraint.Defined,
    }),
  },
});

/**
 * Selector for the form error messages
 */
export const addRentPaymentFormErrorSelector = selector<
ValidationErrorMessages<RentPaymentInput>
>({
  key: 'addRentPaymentState-formError',
  get: ({ get }) => get(addRentPaymentState).formErrors,
});

/**
 * Selector for the form input
 */
export const addRentPaymentFormInputSelector = selector<RentPaymentInput>({
  key: 'addRentPaymentState-formInput',
  get: ({ get }) => get(addRentPaymentState).formInput,
  set: ({ set }, input) => {
    set(addRentPaymentState, (state) => ({
      ...state,
      formInput: input as RentPaymentInput,
      formErrors: {
        ...state.formErrors,
        ...state.formValidator.validateDifference(
          state.formInput,
          input as RentPaymentInput,
        ),
      },
    }));
  },
});

export default addRentPaymentState;
