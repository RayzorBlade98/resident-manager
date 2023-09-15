/* eslint-disable max-len */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import View from '../../routes';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import MonthYear from '_/extensions/date/month_year.extension';
import App from '_/renderer/App';
import incidentalsState from '_/states/incidentals/incidentals.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import WaterCostsBuilder from '_/test/builders/waterCosts.builder';

describe('IncidentalsView', () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper
        route={View.Incidentals}
        initializationFunction={() => {
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
          setRecoil(
            waterCostsState,
            new WaterCostsBuilder()
              .addWaterUsageCost(500, new MonthYear(8, 2023))
              .addSewageCost(370, new MonthYear(8, 2023))
              .build(),
          );
        }}
      >
        <App />
      </ReactTestWrapper>,
    );
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

  test('should match image snapshot (water costs)', async () => {
    // Act
    const tab = renderResult.getAllByRole('tab').at(2)!;
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
