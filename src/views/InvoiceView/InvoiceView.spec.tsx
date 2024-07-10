import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import View from '../../routes';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import App from '_/renderer/App';
import invoiceState from '_/states/invoice/invoice.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';

describe('InvoiceView', () => {
  const screenshotSettings = {
    viewport: {
      width: CONTENT_WIDTH,
      height: CONTENT_HEIGHT,
    },
  };
  const invoices = range(0, 5)
    .map((i) => new InvoiceBuilder().withId(i.toString()).build())
    .reverse();
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper route={View.Invoice}>
        <App />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(invoiceState, invoices);
    });

    const selectedInvoice = renderResult.getAllByRole('button').at(2)!;
    fireEvent.click(selectedInvoice);
  });

  test('should match image snapshot (general information)', async () => {
    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
