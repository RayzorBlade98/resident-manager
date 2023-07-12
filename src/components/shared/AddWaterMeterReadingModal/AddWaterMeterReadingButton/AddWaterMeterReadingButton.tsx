import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import addWaterMeterReadingState, {
  WaterMeterReadingInput,
  addWaterMeterReadingFormValidationSelector,
  residentForAddWaterMeterReadingSelector,
} from '../states/add_water_reading_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import { Resident } from '_/models/resident/resident';
import ResidentStateManager from '_/states/resident/resident.state.manager';
import '_/extensions/date/date.extension';

/**
 * Button that submits the input water meter reading infos if they are valid
 */
function AddWaterMeterReadingButton(): JSX.Element {
  const formInput = useRecoilValue(
    addWaterMeterReadingFormValidationSelector,
  ).formInput;
  const resetWaterMeterReadingState = useResetRecoilState(
    addWaterMeterReadingState,
  );

  const selectedResident = useRecoilValue(
    residentForAddWaterMeterReadingSelector,
  ) as Resident;

  const onSuccess = (): void => {
    ResidentStateManager.updateResident(selectedResident.id, {
      waterMeterReadings: [
        ...selectedResident.waterMeterReadings,
        {
          waterMeterCount: formInput.waterMeterCount as number,
          readingDate: formInput.readingDate as Date,
          wasDeductedInInvoice: false,
        },
      ],
    });
    resetWaterMeterReadingState();
  };

  return (
    <FormSubmitButton<WaterMeterReadingInput>
      buttonText="Hinzufügen"
      formState={addWaterMeterReadingFormValidationSelector}
      onSuccess={onSuccess}
    />
  );
}

export default AddWaterMeterReadingButton;
