import { RenderResult, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import View from '../../../routes';
import AppBar from './AppBar';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('AppBar', () => {
  const previousRoute = View.Resident;

  let renderResult: RenderResult;
  let currentRoute: string;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper
        routingHistory={[previousRoute]}
        route={View.Main}
        onRouteChange={(route) => {
          currentRoute = route;
        }}
      >
        <AppBar />
      </ReactTestWrapper>,
    );
  });

  test('should navigate to previous route', () => {
    // Act
    const backButton = renderResult.getByRole('button');
    fireEvent.click(backButton);

    // Assert
    expect(currentRoute).toBe(previousRoute);
  });

  test('should match snapshot', async () => {
    // Assert
    const screenshotSettings = { viewport: { width: 800, height: 50 } };
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
