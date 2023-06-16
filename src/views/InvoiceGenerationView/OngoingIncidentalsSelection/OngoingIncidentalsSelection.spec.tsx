/* eslint-disable max-len */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getRecoil, setRecoil } from 'recoil-nexus';
import invoiceGenerationState from '../states/invoice_generation_view_state';
import * as InvoiceGenerationStateModule from '../states/invoice_generation_view_state';
import OngoingIncidentalsSelection from './OngoingIncidentalsSelection';
import incidentalsState from '_/states/incidentals/incidentals.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

describe('OngoingIncidentalsSelection', () => {
  const addSelectedIncidentalsSpy = jest.spyOn(
    InvoiceGenerationStateModule,
    'addSelectedOngoingIncidentals',
  );
  const removeSelectedIncidentalsSpy = jest.spyOn(
    InvoiceGenerationStateModule,
    'removeSelectedOngoingIncidentals',
  );
  const incidentals = range(0, 5).map((i) => new OngoingIncidentalsBuilder()
    .withName(`Incidentals ${i}`)
    .withId(`Incidentals ${i}`)
    .build());
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <OngoingIncidentalsSelection />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(incidentalsState, (state) => ({
        ...state,
        ongoingIncidentals: incidentals,
      }));
      setRecoil(invoiceGenerationState, (state) => ({
        ...state,
        selectedOngoingIncidentals: [],
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

    const selectedIncidentals = getRecoil(
      invoiceGenerationState,
    ).selectedOngoingIncidentals;
    expect(selectedIncidentals).toEqual(expectedIncidentals);
  });

  test('should handle incidentals deselection correctly', () => {
    // Arrange
    const selectedIndices = [1, 2, 4];
    const oldSelectedIncidentals = selectedIndices.map((i) => incidentals[i]);
    act(() => {
      setRecoil(invoiceGenerationState, (state) => ({
        ...state,
        selectedOngoingIncidentals: oldSelectedIncidentals,
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

    const selectedIncidentals = getRecoil(
      invoiceGenerationState,
    ).selectedOngoingIncidentals;
    expect(selectedIncidentals).toHaveLength(0);
  });
});
