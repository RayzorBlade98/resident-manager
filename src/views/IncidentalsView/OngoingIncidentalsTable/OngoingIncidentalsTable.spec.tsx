import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil, setRecoil } from 'recoil-nexus';
import OngoingIncidentalsTable from './OngoingIncidentalsTable';
import createOngoingIncidentalsState from './states/create_ongoing_incidentals_state';
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

  afterEach(() => {
    act(() => {
      resetRecoil(createOngoingIncidentalsState);
    });
  });

  test('should open modal when clicking create incidentals', () => {
    // Act
    const button = renderResult.container.querySelector('td')!;
    fireEvent.click(button);

    // Assert
    const showModal = getRecoil(createOngoingIncidentalsState).showModal;
    expect(showModal).toBe(true);
  });
});
