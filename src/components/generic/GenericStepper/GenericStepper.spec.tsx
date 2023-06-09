/* eslint-disable max-len */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import GenericStepper from '_/components/generic/GenericStepper/GenericStepper';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('GenericStepper', () => {
  let renderResult: RenderResult;
  let onFinishedCallback: jest.Mock;

  function setupRendering(children = 3): void {
    onFinishedCallback = jest.fn();

    renderResult = render(
      <ReactTestWrapper>
        <GenericStepper
          steps={['Step 1', 'Step 2', 'Step 3']}
          onFinished={onFinishedCallback}
        >
          {range(0, children).map((step) => (
            <div className={`content-step${step}`}>Content</div>
          ))}
        </GenericStepper>
      </ReactTestWrapper>,
    );
  }

  beforeEach(() => {
    setupRendering();
  });

  function clickNextButton(): void {
    const button = renderResult.container.querySelectorAll('button')[1];
    fireEvent.click(button);
  }

  function clickBackButton(): void {
    const button = renderResult.container.querySelectorAll('button')[0];
    fireEvent.click(button);
  }

  test('Should render right contents when clicking through steps', () => {
    const checkContent = (step: number) => {
      const content = renderResult.container.querySelector(
        `.content-step${step}`,
      );
      expect(content).toBeDefined();
    };

    checkContent(0);
    clickNextButton();
    checkContent(1);
    clickNextButton();
    checkContent(2);
    clickBackButton();
    checkContent(1);
    clickBackButton();
    checkContent(0);
  });

  test('Should use callback when finished', () => {
    // Act
    clickNextButton();
    clickNextButton();
    clickNextButton();

    // Assert
    expect(onFinishedCallback).toHaveBeenCalledTimes(1);
  });

  test('Should throw expection for wrong amount of children', () => {
    // Act
    let error = false;
    try {
      setupRendering(2);
    } catch (e) {
      error = true;
    }

    // Assert
    expect(error).toBeTruthy();
  });
});
