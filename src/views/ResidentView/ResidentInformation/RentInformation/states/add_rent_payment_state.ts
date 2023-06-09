import { atom } from 'recoil';
import { ValidationConstraint } from '../../../../../utils/validation/validation_constraints';
import MonthYear from '_/extensions/date/month_year.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import {
  CompleteFormValidationState,
  Validator,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';

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
}

/**
 * State that holds all information of the rent payment adding process
 */
const addRentPaymentState = atom<
CompleteFormValidationState<AddRentPaymentState, RentPaymentInput>
>({
  key: 'addRentPaymentState',
  default: {
    selectedRentMonth: undefined,
    showModal: false,
    formValidation: {
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
  },
});

/**
 * Selector for the form validation state
 */
// eslint-disable-next-line max-len
export const addRentPaymentFormValidationSelector = createFormValidationStateSelector<AddRentPaymentState, RentPaymentInput>(
  addRentPaymentState,
);

export default addRentPaymentState;
