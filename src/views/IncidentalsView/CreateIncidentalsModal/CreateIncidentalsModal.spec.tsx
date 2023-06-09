import { act, render } from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import createIncidentalsState from '../states/create_incidentals_state';
import CreateIncidentalsModal from './CreateIncidentalsModal';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';

describe('CreateIncidentalsModal', () => {
  test('should match snapshot', () => {
    // Arrange
    const renderResult = render(
      <RecoilTestWrapper>
        <CreateIncidentalsModal />
      </RecoilTestWrapper>,
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
