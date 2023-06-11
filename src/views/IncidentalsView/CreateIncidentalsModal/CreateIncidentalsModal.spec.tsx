import { act, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import createIncidentalsState from '../states/create_incidentals_state';
import CreateIncidentalsModal from './CreateIncidentalsModal';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateIncidentalsModal', () => {
  test('should match image snapshot', async () => {
    // Arrange
    render(
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
    expect(
      await generateImage({ viewport: { width: 650, height: 400 } }),
    ).toMatchImageSnapshot();
  });
});
