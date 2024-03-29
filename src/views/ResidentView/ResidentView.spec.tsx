import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import View from '../../routes';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import MonthYear from '_/extensions/date/month_year.extension';
import App from '_/renderer/App';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import NameBuilder from '_/test/builders/name.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';

describe('ResidentView', () => {
  const screenshotSettings = {
    viewport: {
      width: CONTENT_WIDTH,
      height: CONTENT_HEIGHT,
    },
  };
  const residents = range(0, 8).map((i) => new ResidentBuilder()
    .withName(
      new NameBuilder()
        .withFirstName('Max')
        .withLastName(`Mustermann ${i}`)
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(2, 2023))
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(3, 2023))
        .withPayment(1, new Date(2023, 5, 11))
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(4, 2023))
        .withPayment(60000, new Date(2023, 5, 11))
        .build(),
    )
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 2, 1))
        .withWaterMeterCount(1337)
        .withWasDeductedInInvoice(true)
        .build(),
    )
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 4, 13))
        .withWaterMeterCount(420)
        .withWasDeductedInInvoice(false)
        .build(),
    )
    .build());
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper route={View.Resident}>
        <App />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(residentState, residents);
    });

    const selectedInvoice = renderResult.getAllByRole('button').at(2)!;
    fireEvent.click(selectedInvoice);
  });

  test('should match image snapshot (general information)', async () => {
    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });

  test('should match image snapshot (rent information)', async () => {
    // Act
    const tabs = renderResult.getAllByRole('tab');
    fireEvent.click(tabs[1]);

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });

  test('should match image snapshot (water reading information)', async () => {
    // Act
    const tabs = renderResult.getAllByRole('tab');
    fireEvent.click(tabs[2]);

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
