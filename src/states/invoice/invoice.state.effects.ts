/* eslint-disable import/prefer-default-export */

import { AtomEffect } from 'recoil';
import { InvoiceState } from './invoice.state';

/**
 *
 */
export const sortInvoicesEffect: AtomEffect<InvoiceState> = ({
  onSet,
  setSelf,
}) => {
  onSet((newValue) => {
    setSelf(
      newValue.sort((a, b) => a.start.getTime() - b.start.getTime()).reverse(),
    );
  });
};
