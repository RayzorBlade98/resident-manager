/* eslint-disable max-len */

import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getRecoil, setRecoil } from 'recoil-nexus';
import invoiceGenerationState, {
  addSelectedIncidentals,
  removeSelectedIncidentals,
  selectedInvoiceIncidentalsState,
} from './invoice_generation_view_state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import IncidentalsBuilder from '_/test/builders/incidentals.builder';

describe('invoiceGenerationViewState', () => {
  beforeEach(() => {
    render(<ReactTestWrapper />);
  });

  describe('selectedInvoiceIncidentalsState', () => {
    test('Should select right values', () => {
      // Arrange
      const expectedState = [
        new IncidentalsBuilder().build(),
        new IncidentalsBuilder().build(),
        new IncidentalsBuilder().build(),
      ];
      act(() => {
        setRecoil(invoiceGenerationState, (state) => ({
          ...state,
          selectedIncidentals: expectedState,
        }));
      });

      // Act
      const selectedState = getRecoil(selectedInvoiceIncidentalsState);

      // Assert
      expect(selectedState).toEqual(expectedState);
    });
  });

  describe('addSelectedIncidentals', () => {
    test('Should add incidentals to state', () => {
      // Arrange
      const newIncidentals1 = new IncidentalsBuilder().build();
      const newIncidentals2 = new IncidentalsBuilder().build();
      const expectedState = [
        ...getRecoil(selectedInvoiceIncidentalsState),
        newIncidentals1,
        newIncidentals2,
      ];

      // Act
      act(() => {
        addSelectedIncidentals(newIncidentals1);
        addSelectedIncidentals(newIncidentals2);
      });

      // Assert
      const newState = getRecoil(selectedInvoiceIncidentalsState);
      expect(newState).toEqual(expectedState);
    });
  });

  describe('removeSelectedIncidentals', () => {
    test('Should remove incidentals from state', () => {
      // Arrange
      const newIncidentals1 = new IncidentalsBuilder().build();
      const newIncidentals2 = new IncidentalsBuilder().build();
      const expectedState = getRecoil(selectedInvoiceIncidentalsState);
      act(() => {
        addSelectedIncidentals(newIncidentals1);
        addSelectedIncidentals(newIncidentals2);
      });

      // Act
      act(() => {
        removeSelectedIncidentals(newIncidentals1);
        removeSelectedIncidentals(newIncidentals2);
      });

      // Assert
      const newState = getRecoil(selectedInvoiceIncidentalsState);
      expect(newState).toEqual(expectedState);
    });
  });
});
