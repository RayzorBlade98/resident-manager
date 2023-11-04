import { atom } from 'recoil';
import { ValidationConstraint } from '../../../utils/validation/constraints';
import {
  CompleteFormValidationState,
  createFormValidationStateSelector,
} from '../../../utils/validation/validation';
import Validator from '../../../utils/validation/validator';

/**
 * All values that can be submitted in the form
 */
export interface InitializationInput {
  /**
   * Number of aparments that get rented in the property
   */
  numberOfApartments: number | undefined;

  /**
   * Zip code of the property
   */
  zipCode: number | undefined

  /**
   * City of the property
   */
  city: string

  /**
   * Street of the property
   */
  street: string

  /**
   * House number of the property
   */
  houseNumber: number | undefined

  /**
   * Current cost of the water usage
   */
  waterUsageCost: number | undefined;

  /**
   * Current cost of the sewage
   */
  sewageCost: number | undefined
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InitializationState {}

/**
 * State for the initialization
 */
const initializationState = atom<
CompleteFormValidationState<InitializationState, InitializationInput>
>({
  key: 'initializationState',
  default: {
    formValidation: {
      formInput: {
        numberOfApartments: undefined,
        zipCode: undefined,
        city: '',
        street: '',
        houseNumber: undefined,
        waterUsageCost: undefined,
        sewageCost: undefined,
      },
      formErrors: {},
      formValidator: new Validator<InitializationInput>({
        numberOfApartments: ValidationConstraint.Defined,
        zipCode: ValidationConstraint.Defined,
        city: ValidationConstraint.NoEmptyString,
        street: ValidationConstraint.NoEmptyString,
        houseNumber: ValidationConstraint.Defined,
        waterUsageCost: ValidationConstraint.Currency,
        sewageCost: ValidationConstraint.Currency,
      }),
    },
  },
});

/**
 * Selector for the property initialization form validation
 */
// eslint-disable-next-line max-len
export const initializationFormValidationSelector = createFormValidationStateSelector<InitializationState, InitializationInput>(
  initializationState,
);

export default initializationState;
