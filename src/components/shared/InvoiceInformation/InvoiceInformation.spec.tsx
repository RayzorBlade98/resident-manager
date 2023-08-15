import { render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import InvoiceInformation from './InvoiceInformation';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';

describe('InvoiceInformation', () => {
  const invoice = new InvoiceBuilder()
    .withStartAndEnd(new MonthYear(7, 2023), new MonthYear(9, 2023))
    .build();

  beforeEach(() => {
    render(
      <ReactTestWrapper>
        <InvoiceInformation invoice={invoice} />
      </ReactTestWrapper>,
    );
  });

  test('should match snapshot (general information()', async () => {
    // Assert
    expect(await generateImage()).toMatchImageSnapshot();
  });
});
