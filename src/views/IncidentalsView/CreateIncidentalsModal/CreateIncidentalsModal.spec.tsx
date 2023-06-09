import { act, render } from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import createIncidentalsState from '../states/create_incidentals_state';
import CreateIncidentalsModal from './CreateIncidentalsModal';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateIncidentalsModal', () => {
  test('should match snapshot', () => {
    // Arrange
    const renderResult = render(
      <ReactTestWrapper>
        <CreateIncidentalsModal />
      </ReactTestWrapper>,
    );
    act(() => {
      setRecoil(createIncidentalsState, (state) => ({
        ...state,
        showModal: true,
      }));
    });

    // Assert
    expect(renderResult.baseElement).toMatchSnapshot();
  });
});
