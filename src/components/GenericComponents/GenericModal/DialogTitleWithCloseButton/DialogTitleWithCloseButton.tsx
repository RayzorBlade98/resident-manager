import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, IconButton, Theme } from '@mui/material';
import React from 'react';

const styles = {
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    color: (theme: Theme) => theme.palette.grey[500],
  },
};

interface DialogTitleWithCloseButtonProps {
  onClose: () => void;
}

/**
 * Dialog title component that has a close button
 */
function DialogTitleWithCloseButton(
  props: React.PropsWithChildren<DialogTitleWithCloseButtonProps>,
) {
  return (
    <DialogTitle>
      {props.children}
      <IconButton
        aria-label="close"
        onClick={props.onClose}
        sx={styles.closeButton}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}

export default DialogTitleWithCloseButton;
