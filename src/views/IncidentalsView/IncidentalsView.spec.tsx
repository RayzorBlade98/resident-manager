import { RenderResult, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { setRecoil } from 'recoil-nexus';
import View from '../../routes';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import App from '_/renderer/App';
import incidentalsState from '_/states/incidentals/incidentals.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import { OngoingIncidentalsCostBuilder } from '_/test/builders/ongoingIncidentalsCost.builder';
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
                .withCosts([
                  new OngoingIncidentalsCostBuilder()
                    .withDueDate(new MonthYear(8, 2024))
                    .withPaymentDate(new Date(2024, 8, 8))
                    .withCost(12300)
                    .withBillDocumentId('bill1')
                    .withBankTransferDocumentId('bankTransfer1')
                    .build(),
                  new OngoingIncidentalsCostBuilder()
                    .withDueDate(new MonthYear(6, 2024))
                    .withPaymentDate(new Date(2024, 6, 12))
                    .withCost(8100)
                    .build(),
                ])
                .build(),
              new OngoingIncidentalsBuilder()
                .withId('id2')
                .withCosts([])
                .build(),
              new OngoingIncidentalsBuilder().withId('id3').build(),
            ],
            oneTimeIncidentals: [
              new OneTimeIncidentalsBuilder()
                .withId('id1')
                .withName('One Time Incidentals 1')
                .withCosts(12300)
                .withBillingDate(new Date(2023, 5, 16))
                .withDeductionType(DeductionType.PerApartment)
                .build(),
              new OneTimeIncidentalsBuilder()
                .withId('id2')
                .withName('One Time Incidentals 2')
                .withCosts(32100)
                .withBillingDate(new Date(2023, 5, 13))
                .withPaymentDate(new Date(2023, 5, 20))
                .withBillDocumentId('bill1')
                .withBankTransferDocumentId('bankTransfer1')
                .withDeductionType(DeductionType.PerApartment)
                .build(),
              new OneTimeIncidentalsBuilder()
                .withId('id3')
                .withName('One Time Incidentals 3')
                .withCosts(333000)
                .withBillingDate(new Date(2023, 5, 10))
                .withBillDocumentId('bill2')
                .withDeductionType(DeductionType.PerResident)
                .build(),
            ],
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
    // Act
    act(() => {
      fireEvent.click(
        renderResult.baseElement.querySelector(
          'td > .MuiIconButton-sizeSmall',
        )!,
      );
    });

    await new Promise((r) => {
      setTimeout(r, 300);
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
