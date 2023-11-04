/* eslint-disable max-len */

import { render } from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getRecoil, setRecoil } from 'recoil-nexus';
import {
  InvoiceGenerationInput,
  InvoiceGenerationSteps,
  addSelectedOneTimeIncidentals,
  addSelectedOngoingIncidentals,
  invoiceGenerationViewState,
  isCurrentStepFinishedSelector,
  removeSelectedOneTimeIncidentals,
  removeSelectedOngoingIncidentals,
  residentsForInvoiceSelector,
} from './invoice_generation_view_state';
import MonthYear from '_/extensions/date/month_year.extension';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';

describe('invoiceGenerationViewState', () => {
  beforeEach(() => {
    render(<ReactTestWrapper />);
  });

  describe('addSelectedOngoingIncidentals', () => {
    test('Should add incidentals to state', () => {
      // Arrange
      const newIncidentals1 = new OngoingIncidentalsBuilder().build();
      const newIncidentals2 = new OngoingIncidentalsBuilder().build();
      const expectedState = [
        ...getRecoil(invoiceGenerationViewState).selectedOngoingIncidentals,
        newIncidentals1,
        newIncidentals2,
      ];

      // Act
      act(() => {
        addSelectedOngoingIncidentals(newIncidentals1);
        addSelectedOngoingIncidentals(newIncidentals2);
      });

      // Assert
      const newState = getRecoil(
        invoiceGenerationViewState,
      ).selectedOngoingIncidentals;
      expect(newState).toEqual(expectedState);
    });
  });

  describe('removeSelectedOngoingIncidentals', () => {
    test('Should remove incidentals from state', () => {
      // Arrange
      const newIncidentals1 = new OngoingIncidentalsBuilder().build();
      const newIncidentals2 = new OngoingIncidentalsBuilder().build();
      const expectedState = getRecoil(
        invoiceGenerationViewState,
      ).selectedOngoingIncidentals;
      act(() => {
        addSelectedOngoingIncidentals(newIncidentals1);
        addSelectedOngoingIncidentals(newIncidentals2);
      });

      // Act
      act(() => {
        removeSelectedOngoingIncidentals(newIncidentals1);
        removeSelectedOngoingIncidentals(newIncidentals2);
      });

      // Assert
      const newState = getRecoil(
        invoiceGenerationViewState,
      ).selectedOngoingIncidentals;
      expect(newState).toEqual(expectedState);
    });
  });

  describe('addSelectedOneTimeIncidentals', () => {
    test('Should add incidentals to state', () => {
      // Arrange
      const newIncidentals1 = new OneTimeIncidentalsBuilder().build();
      const newIncidentals2 = new OneTimeIncidentalsBuilder().build();
      const expectedState = [
        ...getRecoil(invoiceGenerationViewState).selectedOneTimeIncidentals,
        newIncidentals1,
        newIncidentals2,
      ];

      // Act
      act(() => {
        addSelectedOneTimeIncidentals(newIncidentals1);
        addSelectedOneTimeIncidentals(newIncidentals2);
      });

      // Assert
      const newState = getRecoil(
        invoiceGenerationViewState,
      ).selectedOneTimeIncidentals;
      expect(newState).toEqual(expectedState);
    });
  });

  describe('removeSelectedOneTimeIncidentals', () => {
    test('Should remove incidentals from state', () => {
      // Arrange
      const newIncidentals1 = new OneTimeIncidentalsBuilder().build();
      const newIncidentals2 = new OneTimeIncidentalsBuilder().build();
      const expectedState = getRecoil(
        invoiceGenerationViewState,
      ).selectedOneTimeIncidentals;
      act(() => {
        addSelectedOneTimeIncidentals(newIncidentals1);
        addSelectedOneTimeIncidentals(newIncidentals2);
      });

      // Act
      act(() => {
        removeSelectedOneTimeIncidentals(newIncidentals1);
        removeSelectedOneTimeIncidentals(newIncidentals2);
      });

      // Assert
      const newState = getRecoil(
        invoiceGenerationViewState,
      ).selectedOneTimeIncidentals;
      expect(newState).toEqual(expectedState);
    });
  });

  describe('residentsForInvoiceSelector', () => {
    const invoiceStart = new MonthYear(3, 2023);
    const invoiceEnd = new MonthYear(8, 2023);

    const includedResidents = range(0, 9).map((i) => new ResidentBuilder().withContractStart(new MonthYear(i, 2023)).build());
    const excludedResidents = range(9, 12).map((i) => new ResidentBuilder().withContractStart(new MonthYear(i, 2023)).build());
    const residents = [...includedResidents, ...excludedResidents];

    beforeEach(() => {
      act(() => {
        setRecoil(residentState, residents);
      });
    });

    test('should return all residents if no timespan is set', () => {
      // Arrange
      act(() => {
        setRecoil(invoiceGenerationViewState, (state) => ({
          ...state,
          formValidation: {
            ...state.formValidation,
            formInput: {
              ...state.formValidation.formInput,
              invoiceStart: undefined,
              invoiceEnd: undefined,
            },
          },
        }));
      });

      // Assert
      expect(getRecoil(residentsForInvoiceSelector)).toEqual(residents);
    });

    test('should only return included residents if timespan is set', () => {
      // Arrange
      act(() => {
        setRecoil(invoiceGenerationViewState, (state) => ({
          ...state,
          formValidation: {
            ...state.formValidation,
            formInput: {
              ...state.formValidation.formInput,
              invoiceStart,
              invoiceEnd,
            },
          },
        }));
      });

      // Assert
      expect(getRecoil(residentsForInvoiceSelector)).toEqual(includedResidents);
    });
  });

  describe('isCurrentStepFinished', () => {
    test.each([
      [
        InvoiceGenerationSteps.Timespan,
        'invoiceStart: undefined, invoiceEnd: undefined',
        false,
        {
          invoiceStart: undefined,
          invoiceEnd: undefined,
        },
      ],
      [
        InvoiceGenerationSteps.Timespan,
        'invoiceStart: 06.2023, invoiceEnd: undefined',
        false,
        {
          invoiceStart: new MonthYear(5, 2023),
          invoiceEnd: undefined,
        },
      ],
      [
        InvoiceGenerationSteps.Timespan,
        'invoiceStart: undefined, invoiceEnd: 06.2023',
        false,
        {
          invoiceStart: undefined,
          invoiceEnd: new MonthYear(5, 2023),
        },
      ],
      [
        InvoiceGenerationSteps.Timespan,
        'invoiceStart: 06.2023, invoiceEnd: 06.2023',
        true,
        {
          invoiceStart: new MonthYear(5, 2023),
          invoiceEnd: new MonthYear(5, 2023),
        },
      ],
      [
        InvoiceGenerationSteps.OngoingIncidentals,
        '<no input required>',
        true,
        {},
      ],
      [
        InvoiceGenerationSteps.OneTimeIncidentals,
        '<no input required>',
        true,
        {},
      ],
    ])(
      'step %i with input %s should return %s',
      (step, _, expected, formInput: Partial<InvoiceGenerationInput>) => {
        // Arrange
        act(() => {
          setRecoil(invoiceGenerationViewState, (state) => ({
            ...state,
            currentStep: step,
            formValidation: {
              ...state.formValidation,
              formInput: {
                ...state.formValidation.formInput,
                ...formInput,
              },
            },
          }));
        });

        // Assert
        expect(getRecoil(isCurrentStepFinishedSelector)).toBe(expected);
      },
    );

    test(`step ${InvoiceGenerationSteps.WaterMeterReadings} should return true when all residents have an undeducted reading`, () => {
      // Arrange
      act(() => {
        setRecoil(
          residentState,
          range(0, 5).map((_) => new ResidentBuilder()
            .addWaterMeterReading(
              new WaterMeterReadingBuilder()
                .withWasDeductedInInvoice(false)
                .build(),
            )
            .addWaterMeterReading(
              new WaterMeterReadingBuilder()
                .withWasDeductedInInvoice(true)
                .build(),
            )
            .build()),
        );
        setRecoil(invoiceGenerationViewState, (state) => ({
          ...state,
          currentStep: InvoiceGenerationSteps.WaterMeterReadings,
        }));
      });

      // Assert
      expect(getRecoil(isCurrentStepFinishedSelector)).toBe(true);
    });

    test(`step ${InvoiceGenerationSteps.WaterMeterReadings} should return false when one residents doesn't have an undeducted reading`, () => {
      // Arrange
      act(() => {
        setRecoil(residentState, [
          ...range(0, 5).map((_) => new ResidentBuilder()
            .addWaterMeterReading(
              new WaterMeterReadingBuilder()
                .withWasDeductedInInvoice(false)
                .build(),
            )
            .addWaterMeterReading(
              new WaterMeterReadingBuilder()
                .withWasDeductedInInvoice(true)
                .build(),
            )
            .build()),
          new ResidentBuilder()
            .addWaterMeterReading(
              new WaterMeterReadingBuilder()
                .withWasDeductedInInvoice(true)
                .build(),
            )
            .build(),
        ]);
        setRecoil(invoiceGenerationViewState, (state) => ({
          ...state,
          currentStep: InvoiceGenerationSteps.WaterMeterReadings,
        }));
      });

      // Assert
      expect(getRecoil(isCurrentStepFinishedSelector)).toBe(false);
    });
  });
});
