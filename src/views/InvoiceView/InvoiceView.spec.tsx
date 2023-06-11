/* eslint-disable max-len */

import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../types/styles';
import App from '_/renderer/App';
import currentViewState, { View } from '_/states/current_view.state';
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
  const invoices = range(0, 5).map((i) => new InvoiceBuilder().withId(i.toString()).build());
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <App />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(invoiceState, invoices);
      setRecoil(currentViewState, View.Invoice);
    });

    const selectedInvoice = renderResult.getAllByRole('button').at(2)!;
    fireEvent.click(selectedInvoice);
  });

  test('should match image snapshot (general information)', async () => {
    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
