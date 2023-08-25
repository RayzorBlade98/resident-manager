import { RenderResult, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import View from '../../../routes';
import AppBar from './AppBar';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('AppBar', () => {
  let renderResult: RenderResult;
  let currentRoute: string;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper
        route={View.Incidentals}
        onRouteChange={(route) => {
          currentRoute = route;
        }}
      >
        <AppBar returnRoute={View.Main} />
      </ReactTestWrapper>,
    );
  });

  test('should navigate to previous route', () => {
    // Act
    const backButton = renderResult.getByRole('button');
    fireEvent.click(backButton);

    // Assert
    expect(currentRoute).toBe(View.Main);
  });

  test('should match snapshot', async () => {
    // Assert
    const screenshotSettings = { viewport: { width: 800, height: 50 } };
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
