/* eslint-disable import/prefer-default-export */

import _ from 'lodash';
import { AtomEffect } from 'recoil';
import { InvoiceState } from './invoice.state';

/**
 * Effect that sorts the invoices by start month in descending order
 */
export const sortInvoicesEffect: AtomEffect<InvoiceState> = ({
  onSet,
  setSelf,
}) => {
  onSet((newValue) => {
    const sorted = [...newValue].sort(
      (a, b) => b.start.getTime() - a.start.getTime(),
    );
    if (!_.isEqual(newValue, sorted)) {
      setSelf(sorted);
    }
  });
};
