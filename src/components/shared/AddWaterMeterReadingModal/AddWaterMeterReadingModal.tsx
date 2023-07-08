import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import AddWaterMeterReadingButton from './AddWaterMeterReadingButton/AddWaterMeterReadingButton';
import AddWaterMeterReadingForm from './AddWaterMeterReadingForm/AddWaterMeterReadingForm';
import addWaterMeterReadingState from './states/add_water_reading_state';
import GenericModal from '_/components/generic/GenericModal/GenericModal';

/**
 * Modal that provides functionality to insert a new water meter reading
 */
function AddWaterMeterReadingModal(): JSX.Element {
  const waterMeterReadingState = useRecoilValue(addWaterMeterReadingState);
  const resetWaterMeterReadingState = useResetRecoilState(
    addWaterMeterReadingState,
  );

  return (
    <GenericModal
      title="Neuer Wasserzählerstand"
      show={waterMeterReadingState.showModal}
      onClose={resetWaterMeterReadingState}
    >
      {/* Body */}
      <AddWaterMeterReadingForm />
      {/* Footer */}
      <AddWaterMeterReadingButton />
    </GenericModal>
  );
}

export default AddWaterMeterReadingModal;
