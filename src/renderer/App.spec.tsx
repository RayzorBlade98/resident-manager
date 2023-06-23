/* eslint-disable max-len */

import { RenderResult, act, render } from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import App from './App';
import currentViewState, { View } from '_/states/current_view.state';
import { propertyState } from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import PropertyBuilder from '_/test/builders/property.builder';
import * as IncidentalsView from '_/views/IncidentalsView/IncidentalsView';
import * as InvoiceGenerationView from '_/views/InvoiceGenerationView/InvoiceGenerationView';
import * as InvoiceView from '_/views/InvoiceView/InvoiceView';
import * as MainView from '_/views/MainView/MainView';
import * as PropertyInitializationView from '_/views/PropertyInitializationView/PropertyInitializationView';
import * as ResidentView from '_/views/ResidentView/ResidentView';

describe('App', () => {
  const propertyInitializationViewText = 'PropertyInitializationView';
  const mainViewText = 'MainView';
  const residentViewText = 'ResidentView';
  const incidentalsViewText = 'IncidentalsView';
  const invoiceViewText = 'InvoiceView';
  const invoiceGenerationViewText = 'InvoiceGenerationView';
  let renderResult: RenderResult;

  beforeAll(() => {
    jest
      .spyOn(PropertyInitializationView, 'default')
      .mockReturnValue(<div>{propertyInitializationViewText}</div>);
    jest.spyOn(MainView, 'default').mockReturnValue(<div>{mainViewText}</div>);
    jest
      .spyOn(ResidentView, 'default')
      .mockReturnValue(<div>{residentViewText}</div>);
    jest
      .spyOn(IncidentalsView, 'default')
      .mockReturnValue(<div>{incidentalsViewText}</div>);
    jest
      .spyOn(InvoiceView, 'default')
      .mockReturnValue(<div>{invoiceViewText}</div>);
    jest
      .spyOn(InvoiceGenerationView, 'default')
      .mockReturnValue(<div>{invoiceGenerationViewText}</div>);
  });

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <App />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(propertyState, new PropertyBuilder().build());
    });
  });

  test('should render PropertyInitializationView when no property is set', () => {
    // Arrange
    act(() => {
      setRecoil(propertyState, undefined);
    });

    // Assert
    const view = renderResult.queryByText(propertyInitializationViewText);
    expect(view).toBeDefined();
  });

  test.each([
    [mainViewText, View.Main],
    [residentViewText, View.Resident],
    [incidentalsViewText, View.Incidentals],
    [invoiceViewText, View.Invoice],
    [invoiceGenerationViewText, View.InvoiceGeneration],
  ])('should render %s', (expectedContent, view) => {
    // Arrange
    act(() => {
      setRecoil(currentViewState, view);
    });

    // Assert
    const content = renderResult.queryByText(expectedContent);
    expect(content).toBeDefined();
  });
});
