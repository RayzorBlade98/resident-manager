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
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InitializationState {}

/**
 * State for the property initialization
 */
const initializationState = atom<
CompleteFormValidationState<InitializationState, InitializationInput>
>({
  key: 'initializationState',
  default: {
    formValidation: {
      formInput: {
        numberOfApartments: undefined,
      },
      formErrors: {},
      formValidator: new Validator<InitializationInput>({
        numberOfApartments: ValidationConstraint.Defined,
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
