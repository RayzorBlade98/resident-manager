/* eslint-disable default-case */

import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import { InvoiceGenerationSteps } from './states/invoice_generation_view_state';
import MonthYear from '_/extensions/date/month_year.extension';
import App from '_/renderer/App';
import currentViewState, { View } from '_/states/current_view.state';
import incidentalsState from '_/states/incidentals/incidentals.state';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';

describe('InvoiceGenerationView', () => {
  const screenshotSettings = {
    viewport: { width: CONTENT_WIDTH, height: CONTENT_HEIGHT },
    screenshot: { fullPage: true },
  };
  const incidentals = {
    ongoingIncidentals: range(0, 10).map((i) => new OngoingIncidentalsBuilder()
      .withId(i.toString())
      .withName(`Incidentals ${i}`)
      .build()),
    oneTimeIncidentals: range(0, 10).map((i) => new OneTimeIncidentalsBuilder()
      .withId(i.toString())
      .withName(`Incidentals ${i}`)
      .build()),
  };
  const residents = range(0, 8).map((i) => new ResidentBuilder()
    .withId(i.toString())
    .withFirstName(`Max${i}`)
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 6, 9))
        .withWaterMeterCount(1234)
        .withWasDeductedInInvoice(true)
        .build(),
    )
    .withConditionalSetup(i !== 0, (b) => b.addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 6, 10))
        .withWaterMeterCount(1337)
        .withWasDeductedInInvoice(false)
        .build(),
    ))
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(4, 2023))
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(5, 2023))
        .withRent(50000)
        .withIncidentals(10000)
        .withPayment(60000, new Date())
        .build(),
    )
    .withConditionalSetup(i === 1, (b) => b.addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(6, 2023))
        .build(),
    ))
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(7, 2023))
        .build(),
    )
    .build());
  let renderResult: RenderResult;

  function inputTimespanStep(): void {
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(0), {
      target: { value: '06.2023' },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: '07.2023' },
    });
  }

  function inputWaterMeterReadingStep(): void {
    act(() => {
      setRecoil(residentState, (state) => [
        ...state.filter((r) => r.id !== '0'),
        {
          ...residents[0],
          waterMeterReadings: [
            ...residents[0].waterMeterReadings,
            new WaterMeterReadingBuilder()
              .withWasDeductedInInvoice(false)
              .build(),
          ],
        },
      ]);
    });
  }

  function requiredStepInput(step: InvoiceGenerationSteps) {
    switch (step) {
      case InvoiceGenerationSteps.Timespan:
        inputTimespanStep();
        break;
      case InvoiceGenerationSteps.WaterMeterReadings:
        inputWaterMeterReadingStep();
        break;
    }
  }

  function moveToStep(step: InvoiceGenerationSteps) {
    for (let currentStep = 0; currentStep < step; currentStep += 1) {
      requiredStepInput(currentStep);
      fireEvent.click(
        renderResult.getAllByRole('button', { hidden: true }).at(-1)!,
      );
    }
  }

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <App />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(currentViewState, View.InvoiceGeneration);
      setRecoil(incidentalsState, incidentals);
      setRecoil(residentState, residents);
    });
  });

  test('should match image snapshot (step timespan)', async () => {
    // Act
    inputTimespanStep();

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });

  test('should match image snapshot (step ongoing incidentals)', async () => {
    // Arrange
    moveToStep(InvoiceGenerationSteps.OngoingIncidentals);

    // Act
    const selectableIncidentals = renderResult.getAllByRole('listitem');
    [2, 3, 5].forEach((i) => act(() => {
      fireEvent.click(selectableIncidentals[i].firstChild!);
    }));

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });

  test('should match image snapshot (step one time incidentals)', async () => {
    // Arrange
    moveToStep(InvoiceGenerationSteps.OneTimeIncidentals);

    // Act
    const selectableIncidentals = renderResult.getAllByRole('listitem');
    [2, 3, 5].forEach((i) => act(() => {
      fireEvent.click(selectableIncidentals[i].firstChild!);
    }));

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });

  test('should match image snapshot (step water meter reading)', async () => {
    // Arrange
    moveToStep(InvoiceGenerationSteps.WaterMeterReadings);

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });

  test('should match image snapshot (step rent payment)', async () => {
    // Arrange
    moveToStep(InvoiceGenerationSteps.RentPayment);

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
