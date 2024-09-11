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
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import LinkedDocumentBuilder from '_/test/builders/linkedDocument.builder';
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
    .addContractResident(
      new ContractResidentBuilder()
        .withName(
          new NameBuilder()
            .withFirstName('Max')
            .withLastName(`Mustermann ${i}`)
            .build(),
        )
        .build(),
    )
    .withConditionalSetup(i % 2 === 0, (b) => b.addContractResident(
      new ContractResidentBuilder()
        .withName(
          new NameBuilder()
            .withFirstName('Mona')
            .withLastName(`Musterfrau ${i}`)
            .build(),
        )
        .build(),
    ))
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(2, 2023))
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(3, 2023))
        .withPayment(1, new Date(2023, 5, 11))
        .withBankTransferDocumentId('banktransfer1')
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(4, 2023))
        .withPayment(60000, new Date(2023, 5, 11))
        .withBankTransferDocumentId('banktransfer2')
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
    .addDocument(
      new LinkedDocumentBuilder()
        .withName('Document 1')
        .withCreationDate(new Date(2024, 5, 1))
        .withSubjectDate(new Date(2024, 5, 9))
        .build(),
    )
    .addDocument(
      new LinkedDocumentBuilder()
        .withName('Document 2')
        .withCreationDate(new Date(2024, 1, 1))
        .withSubjectDate(new Date(2024, 5, 8))
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

  test('should match image snapshot', async () => {
    // Act + Assert
    const tabs = renderResult.getAllByRole('tab');
    for (const tab of tabs) {
      fireEvent.click(tab);
      expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
    }
  });
});
