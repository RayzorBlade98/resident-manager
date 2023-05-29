/* eslint-disable max-len */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getRecoil, setRecoil } from 'recoil-nexus';
import IncidentalsSelection from '_/components/IncidentalsSelection/IncidentalsSelection';
import { incidentalsState } from '_/states/saveStates/incidentals_state';
import invoiceGenerationState, {
  selectedInvoiceIncidentalsState,
} from '_/states/viewStates/invoice_generation_state';
import * as InvoiceGenerationStateModule from '_/states/viewStates/invoice_generation_state';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import IncidentalsBuilder from '_tests/__test_utils__/builders/incidentals_builder';

describe('IncidentalsSelection', () => {
  const addSelectedIncidentalsSpy = jest.spyOn(
    InvoiceGenerationStateModule,
    'addSelectedIncidentals',
  );
  const removeSelectedIncidentalsSpy = jest.spyOn(
    InvoiceGenerationStateModule,
    'removeSelectedIncidentals',
  );
  const incidentals = range(0, 5).map((i) => new IncidentalsBuilder()
    .withName(`Incidentals ${i}`)
    .withId(`Incidentals ${i}`)
    .build());
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <RecoilTestWrapper>
        <IncidentalsSelection />
      </RecoilTestWrapper>,
    );

    act(() => {
      setRecoil(incidentalsState, incidentals);
      setRecoil(invoiceGenerationState, (state) => ({
        ...state,
        selectedIncidentals: [],
      }));
    });
  });

  test('should handle incidentals selection correctly', () => {
    // Arrange
    const selectedIndices = [1, 2, 4];
    const expectedIncidentals = selectedIndices.map((i) => incidentals[i]);

    // Act
    const selectableIncidentals = renderResult.getAllByRole('listitem');
    selectedIndices.forEach((i) => act(() => {
      fireEvent.click(selectableIncidentals[i].firstChild!);
    }));

    // Assert
    expect(addSelectedIncidentalsSpy.mock.calls).toEqual(
      expectedIncidentals.map((i) => [i]),
    );

    const selectedIncidentals = getRecoil(selectedInvoiceIncidentalsState);
    expect(selectedIncidentals).toEqual(expectedIncidentals);
  });

  test('should handle incidentals deselection correctly', () => {
    // Arrange
    const selectedIndices = [1, 2, 4];
    const oldSelectedIncidentals = selectedIndices.map((i) => incidentals[i]);
    act(() => {
      setRecoil(invoiceGenerationState, (state) => ({
        ...state,
        selectedIncidentals: oldSelectedIncidentals,
      }));
    });

    // Act
    const selectableIncidentals = renderResult.getAllByRole('listitem');
    selectedIndices.forEach((i) => act(() => {
      fireEvent.click(selectableIncidentals[i].firstChild!);
    }));

    // Assert

    expect(removeSelectedIncidentalsSpy).toHaveBeenCalledTimes(3);
    expect(removeSelectedIncidentalsSpy.mock.calls).toEqual(
      oldSelectedIncidentals.map((i) => [i]),
    );

    const selectedIncidentals = getRecoil(selectedInvoiceIncidentalsState);
    expect(selectedIncidentals).toHaveLength(0);
  });

  test('should match snapshot', () => {
    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });

  test('should match snapshot (with selected elements)', () => {
    // Arrange
    act(() => {
      setRecoil(invoiceGenerationState, (state) => ({
        ...state,
        selectedIncidentals: [1, 2, 4].map((i) => incidentals[i]),
      }));
    });

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
