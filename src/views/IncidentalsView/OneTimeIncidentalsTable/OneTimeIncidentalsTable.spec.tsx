import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import OneTimeIncidentalsTable from './OneTimeIncidentalsTable';
import incidentalsState from '_/states/incidentals/incidentals.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';

describe('OneTimeIncidentalsTable', () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <OneTimeIncidentalsTable />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(incidentalsState, (state) => ({
        ...state,
        oneTimeIncidentals: [
          new OneTimeIncidentalsBuilder().withId('id1').build(),
          new OneTimeIncidentalsBuilder().withId('id2').build(),
          new OneTimeIncidentalsBuilder().withId('id3').build(),
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
