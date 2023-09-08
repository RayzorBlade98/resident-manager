import { RenderResult, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import InvoiceInformation from './InvoiceInformation';
import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import OngoingIncidentalsInvoiceInformationBuilder from '_/test/builders/ongoing_incidentals_invoice_information.builder';

describe('InvoiceInformation', () => {
  const invoice = new InvoiceBuilder()
    .withStartAndEnd(new MonthYear(7, 2023), new MonthYear(9, 2023))
    .withOngoingIncidentals(
      new OngoingIncidentalsInvoiceInformationBuilder()
        .withName('Incidentals 1')
        .withDeductionType(DeductionType.PerApartment)
        .withTotalCost(500000)
        .build(),
    )
    .withOngoingIncidentals(
      new OngoingIncidentalsInvoiceInformationBuilder()
        .withName('Incidentals 2')
        .withDeductionType(DeductionType.PerResident)
        .withTotalCost(100000)
        .build(),
    )
    .build();

  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <InvoiceInformation invoice={invoice} />
      </ReactTestWrapper>,
    );
  });

  test('should match snapshot (general information()', async () => {
    // Assert
    expect(await generateImage()).toMatchImageSnapshot();
  });

  test('should match snapshot (ongoing invoice)', async () => {
    // Act
    const tab = renderResult.getAllByRole('tab')[1];
    fireEvent.click(tab);

    // Assert
    expect(await generateImage()).toMatchImageSnapshot();
  });
});
