import _ from 'lodash';
import { atom, selector } from 'recoil';
import { MonthYear } from '_/types/date';
import { CurrencyInCents } from '_/utils/currency';
import {
  ValidationError,
  ValidationErrorMessages,
  createValidationFunction,
} from '_/utils/validation';

/**
 *
 */
export interface RentPaymentInput {
  /**
   *
   */
  paymentAmount: CurrencyInCents | null;

  /**
   *
   */
  paymentDate: Date;
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
      paymentAmount: null,
      paymentDate: new Date(),
    },
    formErrors: {},
  },
});

/**
 *
 */
export const validatePayment = createValidationFunction<RentPaymentInput>({
  paymentAmount: [ValidationError.Null, ValidationError.LessEqualZero],
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
    set(addRentPaymentState, (state) => {
      const difference = _.pickBy(
        input,
        (v, k) => state.formInput[k as keyof RentPaymentInput] !== v,
      );
      const errors = validatePayment(
        input as RentPaymentInput,
      ) as ValidationErrorMessages<RentPaymentInput>;
      const includedErrors = _.pick(errors, Object.keys(difference));
      return {
        ...state,
        formInput: input as RentPaymentInput,
        formErrors: {
          ...state.formErrors,
          ...includedErrors,
        },
      };
    });
  },
});

export default addRentPaymentState;
