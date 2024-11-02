/* eslint-disable react-hooks/rules-of-hooks */

import { act, renderHook } from '@testing-library/react';
import { range } from 'lodash';
import { RecoilRoot } from 'recoil';
import {
  expectedInvoice,
  expectedResidentsAfterInvoiceGeneration,
} from '../../test/data/invoiceGenerationOld/expected';
import { residents } from '../../test/data/invoiceGenerationOld/residents';
import useResidentState from '../useResidentState/useResidentState';
import useInvoiceState from './useInvoiceState';
import MonthYear from '_/extensions/date/month_year.extension';
import invoiceState from '_/states/invoice/invoice.state';
import residentState from '_/states/resident/resident.state';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';
import useMergedHook from '_/test/hooks/useMergedHook';

describe('useInvoiceState', () => {
  InvoiceBuilder.setStart(new MonthYear(10, 2023));
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
          hook: useInvoiceState,
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
    test('should set invoice state correctly', () => {
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

    test('should set resident state correctly', () => {
      // Arrange

      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useMergedHook(useInvoiceState, useResidentState),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.addInvoice({ ...expectedInvoice, id: 'id' });
      });

      // Assert
      expect(result.current.residents).toEqual(
        expectedResidentsAfterInvoiceGeneration,
      );
    });
  });
});
