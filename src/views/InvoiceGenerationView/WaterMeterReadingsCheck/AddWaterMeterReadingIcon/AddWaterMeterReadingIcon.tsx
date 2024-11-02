import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Tooltip } from '@mui/material';
import React, { useState } from 'react';
import AddWaterMeterReadingModal from '_/components/shared/AddWaterMeterReadingModal/AddWaterMeterReadingModal';

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
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AddWaterMeterReadingModal
        show={showModal}
        onCloseModal={() => setShowModal(false)}
        residentId={props.residentId}
      />
      <Tooltip title="Zählerstand hinzufügen" arrow>
        <ControlPointIcon
          onClick={() => setShowModal(true)}
          sx={{ ':hover': { cursor: 'pointer' } }}
        />
      </Tooltip>
    </>
  );
}

export default AddWaterMeterReadingIcon;
