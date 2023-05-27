import { atom, selector } from 'recoil';
import { MonthYear } from '_/types/date';
import { CurrencyInCents } from '_/utils/currency/currency';
import {
  ValidationConstraint,
  ValidationErrorMessages,
  Validator,
} from '_/utils/validation';

/**
 *
 */
interface RentPaymentInput {
  /**
   *
   */
  paymentAmount: CurrencyInCents | undefined;

  /**
   *
   */
  paymentDate: Date | undefined;
}

interface AddRentPaymentState {
  /**
   *
   */
  selectedRentMonth?: MonthYear;

  /**
   *
   */
  showModal: boolean;

  /**
   *
   */
  formInput: RentPaymentInput;

  /**
   *
   */
  formErrors: ValidationErrorMessages<RentPaymentInput>;
}

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
  },
});

/**
 *
 */
export const paymentValidator = new Validator<RentPaymentInput>({
  paymentAmount: ValidationConstraint.Currency,
  paymentDate: ValidationConstraint.Defined,
});

/**
 *
 */
export const addRentPaymentFormErrorSelector = selector<
ValidationErrorMessages<RentPaymentInput>
>({
  key: 'addRentPaymentState-formError',
  get: ({ get }) => get(addRentPaymentState).formErrors,
});

/**
 *
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
        ...paymentValidator.validateDifference(
          state.formInput,
          input as RentPaymentInput,
        ),
      },
    }));
  },
});

export default addRentPaymentState;
