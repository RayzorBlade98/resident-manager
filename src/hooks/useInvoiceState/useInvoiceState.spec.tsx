/* eslint-disable react-hooks/rules-of-hooks */

import { act, renderHook } from '@testing-library/react';
import { range } from 'lodash';
import { RecoilRoot } from 'recoil';
import useInvoiceState from './useInvoiceState';
import invoiceState from '_/states/invoice/invoice.state';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';

describe('useIncidentalsState', () => {
  const invoices = range(0, 3)
    .map((_) => new InvoiceBuilder().build())
    .reverse();

  describe('invoices', () => {
    test('should return right invoices', () => {
      // Arrange
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: invoiceState,
          stateValue: invoices,
          hook: () => useInvoiceState(),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Assert
      expect(result.current.invoices).toEqual(invoices);
    });
  });

  describe('addInvoice', () => {
    test('should set state correctly', () => {
      // Arrange
      const { result } = renderHook(useInvoiceState, {
        wrapper: RecoilRoot,
      });

      // Act
      act(() => {
        invoices.forEach(result.current.addInvoice);
      });

      // Assert
      expect(result.current.invoices).toEqual(invoices);
    });
  });
});
