import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';
import { RentInformation } from '_/models/resident/rent';
import React from 'react';

type PaymentNoteIconProps = {
  rent: RentInformation;
};

/**
 * Info icon that displays the payment note via tooltip
 */
export function PaymentNoteIcon(props: PaymentNoteIconProps) {
  if (!props.rent.paymentNote) {
    return null;
  }

  return (
    <Tooltip
      title={
        <div style={{ whiteSpace: 'pre-line' }}>{props.rent.paymentNote}</div>
      }
      arrow
    >
      <InfoIcon />
    </Tooltip>
  );
}
