import { atom, selector } from 'recoil';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import { Resident } from '_/models/resident/resident';
import residentState from '_/states/resident/resident.state';
import {
  CompleteFormValidationState,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';
import Validator from '_/utils/validation/validator';
import '_/extensions/date/date.extension';

/**
 * Input values of the `AddWaterMeterReadingModal`
 */
export interface WaterMeterReadingInput {
  /**
   * Count of the water meter
   */
  waterMeterCount: number | undefined;

  /**
   * Date the water count was read
   */
  readingDate: Date | undefined;
}

interface WaterMeterReadingState {
  /**
   * Id of the resident for which the water meter reading is added
   */
  residentId: string | undefined;
  /**
   * Whether to show the `AddWaterMeterReadingModal`
   */
  showModal: boolean;
}

/**
 * State that holds all information of the water meter reading adding process
 */
const addWaterMeterReadingState = atom<
CompleteFormValidationState<WaterMeterReadingState, WaterMeterReadingInput>
>({
  key: 'addWaterMeterReadingState',
  default: {
    residentId: undefined,
    showModal: false,
    formValidation: {
      formInput: {
        waterMeterCount: undefined,
        readingDate: new Date().toUTC(),
      },
      formErrors: {},
      formValidator: new Validator<WaterMeterReadingInput>({
        waterMeterCount: ValidationConstraint.Defined,
        readingDate: ValidationConstraint.Defined,
      }),
    },
  },
});

/**
 * Selector for the form validation state
 */
// eslint-disable-next-line max-len
export const addWaterMeterReadingFormValidationSelector = createFormValidationStateSelector<
WaterMeterReadingState,
WaterMeterReadingInput
>(addWaterMeterReadingState);

/**
 *
 */
export const residentForAddWaterMeterReadingSelector = selector<
Resident | undefined
>({
  key: 'addWaterMeterReadingState-resident',
  get: ({ get }) => get(residentState).find(
    (r) => r.id === get(addWaterMeterReadingState).residentId,
  ),
});

export default addWaterMeterReadingState;
