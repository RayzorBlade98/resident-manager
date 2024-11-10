/* eslint-disable react-hooks/rules-of-hooks */

import { act, renderHook } from '@testing-library/react';
import { range } from 'lodash';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { useInvoiceGeneration } from './useInvoiceGeneration';
import MonthYear from '_/extensions/date/month_year.extension';
import incidentalsState, {
  IncidentalsState,
} from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterCostsBuilder from '_/test/builders/waterCosts.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';
import useMergedHook from '_/test/hooks/useMergedHook';
import { generateInvoice } from '_/utils/invoiceGeneration/generateInvoice';

jest.mock('_/utils/invoiceGeneration/generateInvoice', () => ({
  generateInvoice: jest.fn(),
}));

describe('useInvoiceGeneration', () => {
  const invoices = range(0, 5)
    .map(() => new InvoiceBuilder().build())
    .reverse();
  const residents = range(0, 2).map(() => new ResidentBuilder().build());
  const waterCosts = new WaterCostsBuilder().build();
  const incidentals: IncidentalsState = {
    ongoingIncidentals: range(0, 5).map(() => new OngoingIncidentalsBuilder().build()),
    oneTimeIncidentals: range(0, 5).map(() => new OneTimeIncidentalsBuilder().build()),
  };
  const property = new PropertyBuilder().build();
  const landlord = new LandlordBuilder().build();

  const generatedInvoice = new InvoiceBuilder().build();
  const invoiceStart = new MonthYear(2024, 0);
  const invoiceEnd = new MonthYear(2024, 11);
  const newDeductionStart = new MonthYear(2025, 0);

  beforeAll(() => {
    (generateInvoice as jest.Mock).mockReturnValue(generatedInvoice);
  });

  it('should add new invoice to state', () => {
    // Act
    const result = useInvoiceGenerationHook();

    // Assert
    expect(result.current.invoices).toEqual([generatedInvoice, ...invoices]);
    expect(generateInvoice).toHaveBeenLastCalledWith({
      start: invoiceStart,
      end: invoiceEnd,
      newDeductionStart,
      residents,
      ongoingIncidentals: incidentals.ongoingIncidentals,
      oneTimeIncidentals: incidentals.oneTimeIncidentals,
      waterCosts,
      property,
      landlord,
    });
    expect(generateInvoice).toHaveBeenCalledTimes(1);
  });

  function useInvoiceGenerationHook() {
    const { result } = renderHook(
      () => useInitializedRecoilState({
        state: invoiceState,
        stateValue: invoices,
        hook: () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useInitializedRecoilState({
            state: waterCostsState,
            stateValue: waterCosts,
            hook: () => useInitializedRecoilState({
              state: incidentalsState,
              stateValue: incidentals,
              hook: () => useInitializedRecoilState({
                state: propertyState,
                stateValue: property,
                hook: () => useInitializedRecoilState({
                  state: landlordState,
                  stateValue: landlord,
                  hook: () => useMergedHook(
                    () => ({
                      generateInvoice: useInvoiceGeneration(),
                    }),
                    () => ({
                      invoices: useRecoilValue(invoiceState),
                    }),
                  ),
                }),
              }),
            }),
          }),
        }),
      }),
      {
        wrapper: RecoilRoot,
      },
    );

    act(() => result.current.generateInvoice(
      invoiceStart,
      invoiceEnd,
      newDeductionStart,
    ));

    return result;
  }
});
