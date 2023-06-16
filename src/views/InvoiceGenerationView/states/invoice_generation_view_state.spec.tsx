/* eslint-disable max-len */

import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getRecoil, setRecoil } from 'recoil-nexus';
import {
  InvoiceGenerationInput,
  addSelectedOngoingIncidentals,
  invoiceGenerationViewState,
  isCurrentStepFinished,
  removeSelectedOngoingIncidentals,
} from './invoice_generation_view_state';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

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

  describe('isCurrentStepFinished', () => {
    test.each([
      [
        0,
        'invoiceStart: undefined, invoiceEnd: undefined',
        false,
        {
          invoiceStart: undefined,
          invoiceEnd: undefined,
        },
      ],
      [
        0,
        'invoiceStart: 06.2023, invoiceEnd: undefined',
        false,
        {
          invoiceStart: new MonthYear(5, 2023),
          invoiceEnd: undefined,
        },
      ],
      [
        0,
        'invoiceStart: undefined, invoiceEnd: 06.2023',
        false,
        {
          invoiceStart: undefined,
          invoiceEnd: new MonthYear(5, 2023),
        },
      ],
      [
        0,
        'invoiceStart: 06.2023, invoiceEnd: 06.2023',
        true,
        {
          invoiceStart: new MonthYear(5, 2023),
          invoiceEnd: new MonthYear(5, 2023),
        },
      ],
      [1, '<no input required>', true, {}],
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
        // Act
        let result = !expected;
        act(() => {
          result = isCurrentStepFinished();
        });

        // Assert
        expect(result).toBe(expected);
      },
    );
  });
});
