import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import OngoingIncidentalsTable from './OngoingIncidentalsTable';
import incidentalsState from '_/states/incidentals/incidentals.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

describe('OngoingIncidentalsTable', () => {
  let renderResult: RenderResult;

  beforeAll(() => {
    renderResult = render(
      <ReactTestWrapper>
        <OngoingIncidentalsTable />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(incidentalsState, (state) => ({
        ...state,
        ongoingIncidentals: [
          new OngoingIncidentalsBuilder()
            .withId('id1')
            .withInvoiceInterval(1)
            .build(),
          new OngoingIncidentalsBuilder().withId('id2').build(),
          new OngoingIncidentalsBuilder().withId('id3').build(),
        ],
      }));
    });
  });

  test('should open modal when clicking create incidentals', () => {
    // Act
    const button = renderResult.container.querySelector('td')!;
    fireEvent.click(button);

    // Assert
    const modal = renderResult.baseElement.querySelector('[role=dialog]');
    expect(modal).toBeDefined();
  });
});
