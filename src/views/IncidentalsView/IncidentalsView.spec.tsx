/* eslint-disable max-len */

import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import App from '_/renderer/App';
import currentViewState, { View } from '_/states/current_view.state';
import incidentalsState from '_/states/incidentals/incidentals.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

describe('IncidentalsView', () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
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
        oneTimeIncidentals: range(0, 3).map((i) => new OneTimeIncidentalsBuilder().withId(i.toString()).build()),
      }));
    });
  });

  test('should match image snapshot (ongoing incidentals)', async () => {
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

  test('should match image snapshot (one-time incidentals)', async () => {
    // Act
    const tab = renderResult.getAllByRole('tab').at(1)!;
    fireEvent.click(tab);

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
