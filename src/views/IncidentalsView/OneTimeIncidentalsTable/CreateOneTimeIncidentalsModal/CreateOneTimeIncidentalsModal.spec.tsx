import { act, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import createOneTimeIncidentalsState from '../states/create_one_time_incidentals_state';
import CreateOneTimeIncidentalsModal from './CreateOneTimeIncidentalsModal';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateOneTimeIncidentalsModal', () => {
  test('should match image snapshot', async () => {
    // Arrange
    render(
      <ReactTestWrapper>
        <CreateOneTimeIncidentalsModal />
      </ReactTestWrapper>,
    );
    act(() => {
      setRecoil(createOneTimeIncidentalsState, (state) => ({
        ...state,
        showModal: true,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            billingDate: new Date(2023, 5, 16),
          },
        },
      }));
    });

    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 400 } }),
    ).toMatchImageSnapshot();
  });
});
