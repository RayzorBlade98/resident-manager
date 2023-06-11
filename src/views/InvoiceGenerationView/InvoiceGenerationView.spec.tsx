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
import incidentalsState from '_/states/incidentals/incidentals.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import IncidentalsBuilder from '_/test/builders/incidentals.builder';

describe('InvoiceGenerationView', () => {
  const screenshotSettings = {
    viewport: { width: CONTENT_WIDTH, height: CONTENT_HEIGHT },
    screenshot: { fullPage: true },
  };
  const incidentals = range(0, 10).map((i) => new IncidentalsBuilder()
    .withId(i.toString())
    .withName(`Incidentals ${i}`)
    .build());
  let renderResult: RenderResult;

  function nextStep(times: number): void {
    for (let index = 0; index < times; index += 1) {
      fireEvent.click(
        renderResult.getAllByRole('button', { hidden: true }).at(-1)!,
      );
    }
  }

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <App />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(currentViewState, View.InvoiceGeneration);
      setRecoil(incidentalsState, incidentals);
    });
  });

  test.todo('Step 1 image snapshot');

  test('should match image snapshot (step 2)', async () => {
    // Arrange
    nextStep(1);

    // Act
    const selectableIncidentals = renderResult.getAllByRole('listitem');
    [2, 3, 5].forEach((i) => act(() => {
      fireEvent.click(selectableIncidentals[i].firstChild!);
    }));

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
