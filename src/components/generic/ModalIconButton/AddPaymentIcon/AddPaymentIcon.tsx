import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { Tooltip } from '@mui/material';
import React, { useState } from 'react';

interface ModalProps {
  show: boolean;
  onCloseModal: () => void;
}

interface AddPaymentIconProps {
  /**
   * Modal component that gets open when the icon is clicked
   */
  modal: (props: ModalProps) => JSX.Element;

  /**
   * Whether to hide the icon button
   */
  hidden?: boolean;
}

/**
 * Icon button to open an add payment modal
 */
export function AddPaymentIcon(props: AddPaymentIconProps): JSX.Element | null {
  const [showModal, setShowModal] = useState(false);

  if (props.hidden) {
    return null;
  }

  return (
    <>
      {props.modal({
        show: showModal,
        onCloseModal: () => setShowModal(false),
      })}
      <Tooltip title="Zahlung hinzufügen" arrow>
        <PaymentsOutlinedIcon
          onClick={() => setShowModal(true)}
          sx={{ ':hover': { cursor: 'pointer' } }}
        />
      </Tooltip>
    </>
  );
}
