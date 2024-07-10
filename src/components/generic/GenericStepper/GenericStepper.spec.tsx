import { Box } from '@mui/material';
import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import GenericStepper, {
  STEPPER_FINISHED,
} from '_/components/generic/GenericStepper/GenericStepper';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('GenericStepper', () => {
  let renderResult: RenderResult;
  let onStepChangeCallback: jest.Mock;

  function setupRendering(children = 3, disable = false): void {
    onStepChangeCallback = jest.fn();

    renderResult = render(
      <ReactTestWrapper>
        <GenericStepper
          steps={['Step 1', 'Step 2', 'Step 3']}
          onStepChange={onStepChangeCallback}
          canFinishStep={!disable}
        >
          {range(0, children).map((step) => (
            <Box
              sx={{ height: '200px', width: '100%', backgroundColor: 'gray' }}
              className={`content-step${step}`}
            >
              Content
            </Box>
          ))}
        </GenericStepper>
      </ReactTestWrapper>,
    );
  }

  beforeEach(() => {
    setupRendering();
  });

  afterEach(() => {
    jest.resetAllMocks();
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

  test('should use callback when changing a step', () => {
    const checkCallback = (step: number, times: number) => {
      expect(onStepChangeCallback).toHaveBeenCalledTimes(times);
      if (step !== 0) {
        expect(onStepChangeCallback).toHaveBeenLastCalledWith(step);
      }
    };

    checkCallback(0, 0);
    clickNextButton();
    checkCallback(1, 1);
    clickNextButton();
    checkCallback(2, 2);
    clickBackButton();
    checkCallback(1, 3);
    clickBackButton();
    checkCallback(0, 4);
  });

  test("should disable next button when step can't be finished", () => {
    // Arrange
    cleanup();
    setupRendering(3, true);

    // Act
    clickNextButton();

    // Assert
    expect(onStepChangeCallback).toHaveBeenCalledTimes(0);
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

  test('should use callback with STEPPER_FINISHED when all steps are finished', () => {
    // Act
    clickNextButton();
    clickNextButton();
    clickNextButton();

    // Assert
    expect(onStepChangeCallback).toHaveBeenLastCalledWith(STEPPER_FINISHED);
  });

  test('should match image snapshot', async () => {
    // Arrange
    clickNextButton();

    // Assert
    expect(
      await generateImage({
        viewport: { height: 350, width: 600 },
        screenshot: { fullPage: true },
      }),
    ).toMatchImageSnapshot();
  });
});
