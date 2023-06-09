import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, resetRecoil, setRecoil } from 'recoil-nexus';
import createIncidentalsState from '../states/create_incidentals_state';
import IncidentalsTable from './IncidentalsTable';
import incidentalsState from '_/states/incidentals/incidentals.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import IncidentalsBuilder from '_/test/builders/incidentals.builder';

describe('IncidentalsTable', () => {
  let renderResult: RenderResult;

  beforeAll(() => {
    renderResult = render(
      <ReactTestWrapper>
        <IncidentalsTable />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(incidentalsState, [
        new IncidentalsBuilder().withId('id1').withInvoiceInterval(1).build(),
        new IncidentalsBuilder().withId('id2').build(),
        new IncidentalsBuilder().withId('id3').build(),
      ]);
    });
  });

  afterEach(() => {
    act(() => {
      resetRecoil(createIncidentalsState);
    });
  });

  test('should open modal when clicking create incidentals', () => {
    // Act
    const button = renderResult.container.querySelector('td')!;
    fireEvent.click(button);

    // Assert
    const showModal = getRecoil(createIncidentalsState).showModal;
    expect(showModal).toBe(true);
  });

  test('should match snapshot', () => {
    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
