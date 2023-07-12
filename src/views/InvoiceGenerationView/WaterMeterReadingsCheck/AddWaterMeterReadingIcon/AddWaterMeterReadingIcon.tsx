import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Tooltip } from '@mui/material';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import addWaterMeterReadingState from '_/components/shared/AddWaterMeterReadingModal/states/add_water_reading_state';

interface AddWaterMeterReadingIconProps {
  /**
   * Resident for which the water meter reading should be added
   */
  residentId: string;
}

/**
 * Icon that opens the `AddWaterMeterReadingModal` when clicked
 */
function AddWaterMeterReadingIcon(
  props: AddWaterMeterReadingIconProps,
): JSX.Element {
  const setAddWaterMeterReadingState = useSetRecoilState(
    addWaterMeterReadingState,
  );

  const onClick = () => {
    setAddWaterMeterReadingState((state) => ({
      ...state,
      showModal: true,
      residentId: props.residentId,
    }));
  };

  return (
    <Tooltip title="Zählerstand hinzufügen" arrow>
      <ControlPointIcon
        onClick={onClick}
        sx={{ ':hover': { cursor: 'pointer' } }}
      />
    </Tooltip>
  );
}

export default AddWaterMeterReadingIcon;
