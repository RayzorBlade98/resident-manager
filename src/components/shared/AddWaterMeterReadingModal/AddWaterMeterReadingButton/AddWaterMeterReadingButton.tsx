import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import addWaterMeterReadingState, {
  WaterMeterReadingInput,
  addWaterMeterReadingFormValidationSelector,
} from '../states/add_water_reading_state';
import FormSubmitButton from '_/components/form/FormSubmitButton/FormSubmitButton';
import '_/extensions/date/date.extension';
import useResident from '_/hooks/useResident/useResident';

/**
 * Button that submits the input water meter reading infos if they are valid
 */
function AddWaterMeterReadingButton(): JSX.Element {
  const selectedResidentId = useRecoilValue(addWaterMeterReadingState)
    .residentId as string;
  const formInput = useRecoilValue(
    addWaterMeterReadingFormValidationSelector,
  ).formInput;
  const resetWaterMeterReadingState = useResetRecoilState(
    addWaterMeterReadingState,
  );

  const { addWaterMeterReading } = useResident(selectedResidentId);

  const onSuccess = (): void => {
    addWaterMeterReading({
      waterMeterCount: formInput.waterMeterCount as number,
      readingDate: formInput.readingDate as Date,
      wasDeductedInInvoice: false,
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
