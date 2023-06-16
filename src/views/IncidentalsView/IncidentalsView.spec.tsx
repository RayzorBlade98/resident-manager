import { act, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import App from '_/renderer/App';
import currentViewState, { View } from '_/states/current_view.state';
import incidentalsState from '_/states/incidentals/incidentals.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

describe('IncidentalsView', () => {
  test('should match image snapshot', async () => {
    // Arrange
    render(
      <ReactTestWrapper>
        <App />
      </ReactTestWrapper>,
    );
    act(() => {
      setRecoil(currentViewState, View.Incidentals);
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

    // Assert
    expect(
      await generateImage({
        viewport: {
          width: CONTENT_WIDTH,
          height: CONTENT_HEIGHT,
        },
      }),
    ).toMatchImageSnapshot();
  });
});
