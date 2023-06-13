import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import MonthYear from '_/extensions/date/month_year.extension';
import App from '_/renderer/App';
import currentViewState, { View } from '_/states/current_view.state';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('ResidentView', () => {
  const screenshotSettings = {
    viewport: {
      width: CONTENT_WIDTH,
      height: CONTENT_HEIGHT,
    },
  };
  const residents = range(0, 8).map((i) => new ResidentBuilder()
    .withLastName(`Mustermann ${i}`)
    .addRentInformation(new RentInformationBuilder().build())
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
    .build());
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <App />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(residentState, residents);
      setRecoil(currentViewState, View.Resident);
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
});
