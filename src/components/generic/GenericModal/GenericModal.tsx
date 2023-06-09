/* eslint-disable react/jsx-no-useless-fragment */
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import React from 'react';
import DialogTitleWithCloseButton from './DialogTitleWithCloseButton/DialogTitleWithCloseButton';

const styles = {
  content: {
    paddingTop: '20px !important',
  },
};

export interface GenericModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
}

/**
 * Generic modal component.
 *
 * It needs extactly two childs:
 * - The modal content
 * - The modal footer
 */
export function GenericModal(
  props: React.PropsWithChildren<GenericModalProps>,
): JSX.Element {
  const children = React.Children.toArray(props.children);
  if (children.length !== 2) {
    throw new Error(
      'Modal needs exactly two children: The body and footer content',
    );
  }
  return (
    <Dialog open={props.show}>
      <DialogTitleWithCloseButton onClose={props.onClose}>
        {props.title}
      </DialogTitleWithCloseButton>
      <DialogContent sx={styles.content}>{children[0]}</DialogContent>
      <DialogActions>{children[1]}</DialogActions>
    </Dialog>
  );
}

export default GenericModal;
