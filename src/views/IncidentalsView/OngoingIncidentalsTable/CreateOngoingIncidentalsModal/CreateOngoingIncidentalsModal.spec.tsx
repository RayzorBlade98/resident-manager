import { act, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import createOngoingIncidentalsState from '../states/create_ongoing_incidentals_state';
import CreateOngoingIncidentalsModal from './CreateOngoingIncidentalsModal';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateOngoingIncidentalsModal', () => {
  test('should match image snapshot', async () => {
    // Arrange
    render(
      <ReactTestWrapper>
        <CreateOngoingIncidentalsModal />
      </ReactTestWrapper>,
    );
    act(() => {
      setRecoil(createOngoingIncidentalsState, (state) => ({
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
