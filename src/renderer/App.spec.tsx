/* eslint-disable max-len */

import {
  RenderResult, act, cleanup, render,
} from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import View from '../routes';
import App from './App';
import { propertyState } from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import PropertyBuilder from '_/test/builders/property.builder';
import * as IncidentalsView from '_/views/IncidentalsView/IncidentalsView';
import * as PropertyInitializationView from '_/views/InitializationView/InitializationView';
import * as InvoiceGenerationView from '_/views/InvoiceGenerationView/InvoiceGenerationView';
import * as InvoiceView from '_/views/InvoiceView/InvoiceView';
import * as MainView from '_/views/MainView/MainView';
import * as ResidentView from '_/views/ResidentView/ResidentView';

describe('App', () => {
  const propertyInitializationViewText = 'PropertyInitializationView';
  let renderResult: RenderResult;

  beforeAll(() => {
    jest
      .spyOn(PropertyInitializationView, 'default')
      .mockReturnValue(<div>{propertyInitializationViewText}</div>);
    jest.spyOn(MainView, 'default').mockReturnValue(<div>{View.Main}</div>);
    jest
      .spyOn(ResidentView, 'default')
      .mockReturnValue(<div>{View.Resident}</div>);
    jest
      .spyOn(IncidentalsView, 'default')
      .mockReturnValue(<div>{View.Incidentals}</div>);
    jest
      .spyOn(InvoiceView, 'default')
      .mockReturnValue(<div>{View.Invoice}</div>);
    jest
      .spyOn(InvoiceGenerationView, 'default')
      .mockReturnValue(<div>{View.InvoiceGeneration}</div>);
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

  test.each(Object.keys(View).map((k) => [k, View[k as keyof typeof View]]))(
    'should render %s',
    (_, route) => {
      // Arrange
      cleanup();
      renderResult = render(
        <ReactTestWrapper route={route}>
          <App />
        </ReactTestWrapper>,
      );

      // Assert
      const content = renderResult.queryByText(route);
      expect(content).toBeDefined();
    },
  );
});
