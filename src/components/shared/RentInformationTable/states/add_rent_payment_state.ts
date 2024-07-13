import { atom } from 'recoil';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import MonthYear from '_/extensions/date/month_year.extension';
import { Resident } from '_/models/resident/resident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import {
  CompleteFormValidationState,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';
import Validator from '_/utils/validation/validator';
import '_/extensions/date/date.extension';

/**
 * Input values of the `AddRentPaymentModal`
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
   * Resident for which the rent payment is added
   */
  selectedResident?: Resident;

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
        paymentDate: new Date().toUTC(),
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
export const addRentPaymentFormValidationSelector = createFormValidationStateSelector<AddRentPaymentState, RentPaymentInput>(
  addRentPaymentState,
);

export default addRentPaymentState;
