/* eslint-disable default-case */

import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import App from '_/renderer/App';
import currentViewState, { View } from '_/states/current_view.state';
import incidentalsState from '_/states/incidentals/incidentals.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

describe('InvoiceGenerationView', () => {
  const screenshotSettings = {
    viewport: { width: CONTENT_WIDTH, height: CONTENT_HEIGHT },
    screenshot: { fullPage: true },
  };
  const incidentals = {
    ongoingIncidentals: range(0, 10).map((i) => new OngoingIncidentalsBuilder()
      .withId(i.toString())
      .withName(`Incidentals ${i}`)
      .build()),
    oneTimeIncidentals: range(0, 10).map((i) => new OneTimeIncidentalsBuilder()
      .withId(i.toString())
      .withName(`Incidentals ${i}`)
      .build()),
  };
  let renderResult: RenderResult;

  function inputStep1(): void {
    const inputFields = renderResult.container.querySelectorAll('input');
    fireEvent.change(inputFields.item(0), {
      target: { value: '06.2023' },
    });

    fireEvent.change(inputFields.item(1), {
      target: { value: '07.2023' },
    });
  }

  function requiredStepInput(step: number) {
    switch (step) {
      case 1:
        inputStep1();
        break;
    }
  }

  function moveToStep(step: number) {
    for (let currentStep = 1; currentStep < step; currentStep += 1) {
      requiredStepInput(currentStep);
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

  test('should match image snapshot (step 1)', async () => {
    // Act
    inputStep1();

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });

  test('should match image snapshot (step 2)', async () => {
    // Arrange
    moveToStep(2);

    // Act
    const selectableIncidentals = renderResult.getAllByRole('listitem');
    [2, 3, 5].forEach((i) => act(() => {
      fireEvent.click(selectableIncidentals[i].firstChild!);
    }));

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
