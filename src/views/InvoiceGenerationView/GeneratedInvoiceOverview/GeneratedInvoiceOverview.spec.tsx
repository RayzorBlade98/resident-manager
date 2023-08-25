import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import * as InvoiceInformation from '../../../components/shared/InvoiceInformation/InvoiceInformation';
import View from '../../../routes';
import invoiceGenerationViewState, {
  InvoiceGenerationSteps,
} from '../states/invoice_generation_view_state';
import GeneratedInvoiceOverview from './GeneratedInvoiceOverview';
import invoiceState from '_/states/invoice/invoice.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';

describe('GeneratedInvoiceOverview', () => {
  const oldInvoices = [
    new InvoiceBuilder().build(),
    new InvoiceBuilder().build(),
  ];
  const invoice = new InvoiceBuilder().build();

  let renderResult: RenderResult;
  let currentRoute = View.InvoiceGeneration;

  beforeAll(() => {
    jest.spyOn(InvoiceInformation, 'default').mockReturnValue(<div />);
  });

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper
        routingHistory={[View.InvoiceGeneration]}
        onRouteChange={(r) => {
          currentRoute = r;
        }}
      >
        <GeneratedInvoiceOverview />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(invoiceState, oldInvoices);
      setRecoil(invoiceGenerationViewState, (state) => ({
        ...state,
        currentStep: InvoiceGenerationSteps.Finished,
        generatedInvoice: invoice,
      }));
    });
  });

  test('should jump to first invoice generation step when clicking edit button', () => {
    // Act
    const editButton = renderResult.getAllByRole('button')[0];
    fireEvent.click(editButton);

    // Assert
    const currentStep = getRecoil(invoiceGenerationViewState).currentStep;
    expect(currentStep).toBe(0);
  });

  test('should add invoice to state and navigate back to invoice view when clicking the save button', () => {
    // Act
    const saveButton = renderResult.getAllByRole('button')[1];
    fireEvent.click(saveButton);

    // Assert
    expect(getRecoil(invoiceState)).toEqual([invoice, ...oldInvoices]);
    expect(currentRoute).toBe(View.Invoice);
  });
});
