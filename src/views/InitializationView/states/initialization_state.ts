import { atom } from 'recoil';
import { ValidationConstraint } from '../../../utils/validation/constraints';
import {
  CompleteFormValidationState,
  createFormValidationStateSelector,
} from '../../../utils/validation/validation';
import Validator from '../../../utils/validation/validator';
import { Salutation } from '_/models/name';

/**
 * All values that can be submitted in the form
 */
export interface InitializationInput {
  /**
   * Company of the landlord
   */
  companyLandlord: string;

  /**
   * salutation of the landlord
   */
  salutationLandlord: Salutation;

  /**
   * first name of the landlord
   */
  firstNameLandlord: string;

  /**
   * last name of the landlord
   */
  lastNameLandlord: string;

  /**
   * Zip code of the landlord
   */
  zipCodeLandlord: number | undefined;

  /**
   * City of the landlord
   */
  cityLandlord: string;

  /**
   * Street of the landlord
   */
  streetLandlord: string;

  /**
   * House number of the landlord
   */
  houseNumberLandlord: number | undefined;

  /**
   * Number of aparments that get rented in the property
   */
  numberOfApartments: number | undefined;

  /**
   * Zip code of the property
   */
  zipCodeProperty: number | undefined;

  /**
   * City of the property
   */
  cityProperty: string;

  /**
   * Street of the property
   */
  streetProperty: string;

  /**
   * House number of the property
   */
  houseNumberProperty: number | undefined;

  /**
   * Current cost of the water usage
   */
  waterUsageCost: number | undefined;

  /**
   * Current cost of the sewage
   */
  sewageCost: number | undefined;
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
        companyLandlord: '',
        salutationLandlord: Salutation.Male,
        firstNameLandlord: '',
        lastNameLandlord: '',
        zipCodeLandlord: undefined,
        cityLandlord: '',
        streetLandlord: '',
        houseNumberLandlord: undefined,
        numberOfApartments: undefined,
        zipCodeProperty: undefined,
        cityProperty: '',
        streetProperty: '',
        houseNumberProperty: undefined,
        waterUsageCost: undefined,
        sewageCost: undefined,
      },
      formErrors: {},
      formValidator: new Validator<InitializationInput>({
        firstNameLandlord: ValidationConstraint.NoEmptyString,
        lastNameLandlord: ValidationConstraint.NoEmptyString,
        zipCodeLandlord: ValidationConstraint.Defined,
        cityLandlord: ValidationConstraint.NoEmptyString,
        streetLandlord: ValidationConstraint.NoEmptyString,
        houseNumberLandlord: ValidationConstraint.Defined,
        numberOfApartments: ValidationConstraint.Defined,
        zipCodeProperty: ValidationConstraint.Defined,
        cityProperty: ValidationConstraint.NoEmptyString,
        streetProperty: ValidationConstraint.NoEmptyString,
        houseNumberProperty: ValidationConstraint.Defined,
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
